"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../src/lib/prisma";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "../src/lib/arject";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => {
  return { ...obj, amount: obj.amount.toNumber() };
};
const serializeAccount = (obj) => {
  return { ...obj, balance: obj.balance.toNumber() };
};
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    //Rate limiting the ser on how much the person can create transaction in a day
    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 1, // specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many request, Please Try again later");
      }
      throw new Error("Too many request, Request Blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newtransaction = await tx.transaction.create({
        data: {
          type: data.type,
          amount: data.amount,
          description: data.description || "",
          date: data.date,
          accountId: data.accountId,
          category: data.category,
          isRecurring: data.isRecurring,
          recurrenceInterval: data.recurringInterval || null,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });
      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });
      return newtransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);
    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error(error.message || "Failed to create transaction");
  }
}

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid recurring interval");
  }
  return date;
}

export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
      - Last 4 digits of a card number if visible on the receipt (or null if not present)
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string",
        "cardLastFour": "string or null"
      }
 
      If its not a receipt, return an empty object`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
        cardLastFour: data.cardLastFour ?? null,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error.message);
    throw new Error("Failed to scan receipt");
  }
}
export async function createAccountFromCard(cardLastFour) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Check if an account with this card suffix already exists
    const existing = await db.account.findFirst({
      where: {
        userId: user.id,
        name: { contains: cardLastFour },
      },
    });

    if (existing) {
      return {
        success: true,
        data: serializeAccount(existing),
        created: false,
      };
    }

    // No default if other accounts exist
    const accountCount = await db.account.count({
      where: { userId: user.id },
    });

    const newAccount = await db.account.create({
      data: {
        name: `Card ••••${cardLastFour}`,
        type: "CHECKING",
        balance: 0,
        isDefault: accountCount === 0,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeAccount(newAccount), created: true };
  } catch (error) {
    console.error("Error creating account from card:", error);
    throw new Error(error.message || "Failed to create account from card");
  }
}

export async function getTransactions(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unathorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unathorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // getting the original transaction

    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction was not found");

    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurrenceInterval
              ? calculateNextRecurringDate(data.date, data.recurrenceInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return {
      success: true,
      data: serializeAmount(transaction),
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

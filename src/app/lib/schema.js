import z from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Please provide the Name to continue"),
  type: z.enum(["SAVINGS", "CHECKING"]),
  balance: z.string().min(1, "Please provide Initial Balance to continue"),
  isDefault: z.boolean().default(false),
});

export const transactionSchema = z
  .object({
    type: z.enum(["EXPENSE", "INCOME"]),
    // account: z.string().min(1, "Please select an Account to continue"),
    amount: z.coerce
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0")
      .or(z.literal("").transform(() => undefined))
      .refine((val) => val !== undefined, "Amount must be greater than 0"),
    description: z.string().optional(),
    date: z.date({ required_error: "Date is required" }),
    accountId: z.string().min(1, "Please select an Account to continue"),
    category: z.string().min(1, "Please select a Category to continue"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
  })
  .refine((data) => !data.isRecurring || data.recurringInterval, {
    message:
      "Please select a Recurring Interval if the transaction is recurring",
    path: ["recurringInterval"],
  });
// .superRefine((data, ctx) => {
//   if (data.isRecurring && !data.recurringInterval) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Please select a Recurring Interval",
//       path: ["recurringInterval"],
//     });
//   }
// });

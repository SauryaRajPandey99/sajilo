"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { transactionSchema } from "../../../lib/schema";
import useFetch from "../../../../../hooks/use-fetch";
import {
  createTransaction,
  updateTransaction,
} from "../../../../../actions/transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../../../../components/ui/input";
import CreateAccountDrawer from "../../../../components/create-account-drawer";
import { Button } from "../../../../components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../../../../components/ui/calendar";
import { Switch } from "../../../../components/ui/switch";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ReceiptScanner from "./recipt-scanner";

const AddTransactionForm = ({
  accounts: initialAccounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [scannedItems, setScannedItems] = useState(
    initialData?.receiptItems || [],
  );
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const router = useRouter();

  // ref so we can call handleSubmit imperatively from ReceiptScanner callback
  const submitRef = useRef(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            account: "",
            description: "",
            date: new Date(),
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionfn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const category = watch("category");

  // const onSubmit = async (data) => {
  //   const formData = { ...data, amount: parseFloat(data.amount) };
  //   if (editMode) {
  //     transactionfn(editId, formData);
  //   } else {
  //     transactionfn(formData);
  //   }
  // };
  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
      receiptItems: scannedItems,
    };

    if (editMode) {
      transactionfn(editId, formData);
    } else {
      transactionfn(formData);
    }
  };
  useEffect(() => {
    if (editMode && initialData?.receiptItems) {
      setScannedItems(initialData.receiptItems);
    }
  }, [editMode, initialData]);
  // wire submitRef so ReceiptScanner can trigger submit imperatively
  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit);
  });

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  // populate all form fields from scanned receipt data
  const handleScanComplete = (scannedData) => {
    if (!scannedData) return;

    setScannedItems(scannedData.items || []);

    setValue("amount", scannedData.amount.toString(), {
      shouldValidate: true,
      shouldDirty: true,
    });

    // setValue("amount", scannedData.amount.toString(), {
    //   shouldValidate: true,
    //   shouldDirty: true,
    // });
    setValue("date", new Date(scannedData.date), {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (scannedData.description) {
      setValue("description", scannedData.description, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (scannedData.category) {
      const matched = categories.find(
        (cat) => cat.name.toLowerCase() === scannedData.category.toLowerCase(),
      );
      if (matched) {
        setValue("category", matched.id, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
    if (scannedData.accountId) {
      setValue("accountId", scannedData.accountId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // append auto-created account to local list so it appears in the dropdown
  const handleAccountCreated = (newAccount) => {
    setAccounts((prev) => {
      if (prev.some((a) => a.id === newAccount.id)) return prev;
      return [...prev, newAccount];
    });
  };

  // called by ReceiptScanner after everything is resolved — triggers form submit
  const handleAutoSubmit = () => {
    submitRef.current?.();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* {!editMode && ( */}
      <ReceiptScanner
        onScanComplete={handleScanComplete}
        // onAutoSubmit={!editMode ? handleAutoSubmit : undefined}
        accounts={accounts}
        onAccountCreated={handleAccountCreated}
      />
      {/* )} */}
      {scannedItems.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
            Scanned Items
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-2 font-medium">Item</th>
                <th className="text-center px-4 py-2 font-medium">Qty</th>
                <th className="text-right px-4 py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {scannedItems.map((item, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-center text-muted-foreground">
                    {item.quantity ?? 1}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 font-medium">
                <td className="px-4 py-2" colSpan={2}>
                  Total
                </td>
                <td className="px-4 py-2 text-right font-mono">
                  $
                  {scannedItems
                    .reduce(
                      (sum, item) =>
                        sum + parseFloat(item.price) * (item.quantity ?? 1),
                      0,
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(v) => setValue("type", v)}
          defaultValue={getValues("type")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Amount + Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(v) => setValue("accountId", v)}
            value={watch("accountId") || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full select-none items-center text-sm outline-none"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(v) => setValue("category", v)}
          value={category || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full pl-3 text-left font-normal"
            >
              {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => setValue("date", d)}
              disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter Description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Recurring */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(v) => setValue("isRecurring", v)}
        />
      </div>
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(v) => setValue("recurringInterval", v)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-2 w-2/3"
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;

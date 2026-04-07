"use client";

import React, { useEffect, useRef } from "react";
import useFetch from "../../../../../hooks/use-fetch";
import {
  scanReceipt,
  createAccountFromCard,
} from "../../../../../actions/transaction";
import { Camera, Loader2, CreditCard } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";

const ReceiptScanner = ({
  onScanComplete,
  onAutoSubmit,
  accounts = [],
  onAccountCreated,
}) => {
  const fileInputRef = useRef();
  // ref to track whether we should auto-submit after scan completes
  const shouldAutoSubmit = useRef(false);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    data: createdAccountData,
  } = useFetch(createAccountFromCard);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5 MB");
      return;
    }
    shouldAutoSubmit.current = true;
    await scanReceiptFn(file);
  };

  // Step 2 — scan done: resolve account from card digits
  useEffect(() => {
    if (!scannedData || scanReceiptLoading) return;

    const { cardLastFour } = scannedData;

    if (cardLastFour) {
      const existingAccount = accounts.find((acc) =>
        acc.name.includes(cardLastFour),
      );

      if (existingAccount) {
        toast.success(`Linked to existing account: ${existingAccount.name}`);
        const resolved = { ...scannedData, accountId: existingAccount.id };
        onScanComplete(resolved);
        if (shouldAutoSubmit.current) {
          shouldAutoSubmit.current = false;
          // small delay so form values are committed before submit fires
          setTimeout(() => onAutoSubmit?.(), 100);
        }
      } else {
        toast.loading(
          `New card ••••${cardLastFour} detected — creating account…`,
          {
            id: "auto-account",
          },
        );
        createAccountFn(cardLastFour);
      }
    } else {
      // no card found — still populate form and auto-submit
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
      if (shouldAutoSubmit.current) {
        shouldAutoSubmit.current = false;
        setTimeout(() => onAutoSubmit?.(), 100);
      }
    }
  }, [scannedData, scanReceiptLoading]);

  // Step 3 — account resolved: populate form then auto-submit
  useEffect(() => {
    if (!createdAccountData || createAccountLoading) return;

    toast.dismiss("auto-account");

    const { data: newAccount, created } = createdAccountData;

    if (created) {
      toast.success(`Account "${newAccount.name}" created automatically`);
      onAccountCreated?.(newAccount);
    } else {
      toast.success(`Linked to account: ${newAccount.name}`);
    }

    const resolved = { ...scannedData, accountId: newAccount.id };
    onScanComplete(resolved);

    if (shouldAutoSubmit.current) {
      shouldAutoSubmit.current = false;
      setTimeout(() => onAutoSubmit?.(), 100);
    }
  }, [createdAccountData, createAccountLoading]);

  const isLoading = scanReceiptLoading || createAccountLoading;

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        className="w-full h-10 bg-linear-to-br from-green-500 via-cyan-500 to-lime-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : createAccountLoading ? (
          <>
            <CreditCard className="mr-2 animate-pulse" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ReceiptScanner;

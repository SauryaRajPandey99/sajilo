"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  MoreHorizontal,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  Pencil,
  Sparkles,
  ReceiptText,
  Funnel,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Badge } from "../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { categoryColors } from "../../../../../data/categories";
import useFetch from "../../../../../hooks/use-fetch";
import { bulkDeleteTransactions } from "../../../../../actions/accounts";

const RECURRENCE_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const ITEMS_PER_PAGE = 10;

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

const getCategoryStyle = (category) => {
  const color = categoryColors?.[category] || "#71717a";
  return {
    backgroundColor: `${color}18`,
    color,
    borderColor: `${color}30`,
  };
};

const TableSortIcon = ({ active, direction }) => {
  if (!active) {
    return <ChevronDown className="ml-2 h-4 w-4 opacity-30" />;
  }

  return direction === "asc" ? (
    <ChevronUp className="ml-2 h-4 w-4" />
  ) : (
    <ChevronDown className="ml-2 h-4 w-4" />
  );
};

const TransactionTable = ({ transactions = [] }) => {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [recurringFilter, setRecurringFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    fn: deleteFn,
    loading: deleteLoading,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const uniqueCategories = useMemo(() => {
    return [
      ...new Set(transactions.map((t) => t.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();

      result = result.filter((transaction) => {
        const amount = Number(transaction.amount) || 0;
        const formattedAmount = amount.toFixed(2);
        const type = transaction.type || "";
        const category = transaction.category || "";
        const description = transaction.description || "";
        const dateText = transaction.date
          ? format(new Date(transaction.date), "MMM dd, yyyy")
          : "";
        const recurrenceText = transaction.isRecurring
          ? RECURRENCE_INTERVALS[transaction.recurrenceInterval] || "Recurring"
          : "One-time";

        const searchableText = [
          description,
          category,
          type,
          formattedAmount,
          `$${formattedAmount}`,
          dateText,
          recurrenceText,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchLower);
      });
    }

    if (typeFilter !== "ALL") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if (recurringFilter !== "ALL") {
      result = result.filter((transaction) =>
        recurringFilter === "recurring"
          ? transaction.isRecurring
          : !transaction.isRecurring,
      );
    }

    if (categoryFilter !== "ALL") {
      result = result.filter(
        (transaction) => transaction.category === categoryFilter,
      );
    }

    if (minAmount !== "") {
      result = result.filter(
        (transaction) => Number(transaction.amount) >= Number(minAmount),
      );
    }

    if (maxAmount !== "") {
      result = result.filter(
        (transaction) => Number(transaction.amount) <= Number(maxAmount),
      );
    }

    result.sort((a, b) => {
      let compare = 0;

      switch (sortConfig.field) {
        case "date":
          compare = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          compare = Number(a.amount) - Number(b.amount);
          break;
        case "category":
          compare = (a.category || "").localeCompare(b.category || "");
          break;
        case "description":
          compare = (a.description || "").localeCompare(b.description || "");
          break;
        case "type":
          compare = (a.type || "").localeCompare(b.type || "");
          break;
        default:
          compare = 0;
      }

      return sortConfig.direction === "asc" ? compare : -compare;
    });

    const totalPages = Math.max(1, Math.ceil(result.length / ITEMS_PER_PAGE));
    const paginatedData = result.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );

    return {
      data: paginatedData,
      totalPages,
      totalCount: result.length,
    };
  }, [
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    categoryFilter,
    minAmount,
    maxAmount,
    sortConfig,
    currentPage,
  ]);

  const summary = useMemo(() => {
    return filteredAndSortedTransactions.data.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount) || 0;
        if (transaction.type === "INCOME") {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [filteredAndSortedTransactions.data]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = filteredAndSortedTransactions.data.map((t) => t.id);

    setSelectedIds((current) => {
      const allSelected = currentPageIds.every((id) => current.includes(id));

      if (allSelected) {
        return current.filter((id) => !currentPageIds.includes(id));
      }

      return [...new Set([...current, ...currentPageIds])];
    });
  };

  const handleBulkDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    deleteFn(selectedIds);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("ALL");
    setRecurringFilter("ALL");
    setCategoryFilter("ALL");
    setMinAmount("");
    setMaxAmount("");
    setSelectedIds([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    typeFilter,
    recurringFilter,
    categoryFilter,
    minAmount,
    maxAmount,
  ]);

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const currentPageIds = filteredAndSortedTransactions.data.map((t) => t.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const someCurrentPageSelected =
    currentPageIds.some((id) => selectedIds.includes(id)) &&
    !allCurrentPageSelected;

  const hasActiveFilters =
    searchTerm ||
    typeFilter !== "ALL" ||
    recurringFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    minAmount !== "" ||
    maxAmount !== "";

  const totalPages = filteredAndSortedTransactions.totalPages;
  const totalCount = filteredAndSortedTransactions.totalCount;
  const startIndex =
    totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  const pageItems = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((page) => {
      return (
        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
      );
    })
    .reduce((acc, page, idx, arr) => {
      if (idx > 0 && page - arr[idx - 1] > 1) {
        acc.push("...");
      }
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="space-y-6">
      {deleteLoading && (
        <div className="overflow-hidden rounded-full">
          <BarLoader width={"100%"} color={"#10b981"} />
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <div className="border-b border-border/60 px-6 py-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Advanced transaction explorer
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Transactions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Search everything. Filter anything. Manage your transaction
                    data like a modern SaaS app.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-12">
              <div className="relative lg:col-span-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search description, category, amount, date, type..."
                  className="h-11 rounded-2xl border-border/60 bg-background/80 pl-10 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11 rounded-2xl border-border/60 bg-background/80 shadow-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2">
                <Select
                  value={recurringFilter}
                  onValueChange={setRecurringFilter}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-border/60 bg-background/80 shadow-sm">
                    <SelectValue placeholder="Recurring" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="ALL">All Schedules</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="non_recurring">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-border/60 bg-background/80 shadow-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative lg:col-span-1">
                <Input
                  type="number"
                  placeholder="Min"
                  className="h-11 rounded-2xl border-border/60 bg-background/80 shadow-sm"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>

              <div className="relative lg:col-span-1">
                <Input
                  type="number"
                  placeholder="Max"
                  className="h-11 rounded-2xl border-border/60 bg-background/80 shadow-sm"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <Funnel className="h-3.5 w-3.5" />
                {hasActiveFilters ? "Filters are active" : "No filters applied"}
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="h-10 rounded-2xl border-border/60 px-4"
                  onClick={handleClearFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Results
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {filteredAndSortedTransactions.totalCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  matching transactions
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                  Income on page
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600">
                  {formatMoney(summary.income)}
                </p>
                <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                  visible earnings
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-rose-700 dark:text-rose-400">
                  Expense on page
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-rose-600">
                  {formatMoney(summary.expense)}
                </p>
                <p className="text-sm text-rose-700/80 dark:text-rose-400/80">
                  visible spending
                </p>
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                    {selectedIds.length}
                  </div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {selectedIds.length} transaction
                    {selectedIds.length > 1 ? "s" : ""} selected
                  </p>
                </div>

                <Button
                  variant="destructive"
                  className="rounded-xl"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete selected
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="px-2 py-2 md:px-4">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/70">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="w-14 pl-4">
                    <Checkbox
                      checked={
                        allCurrentPageSelected
                          ? true
                          : someCurrentPageSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Date
                      <TableSortIcon
                        active={sortConfig.field === "date"}
                        direction={sortConfig.direction}
                      />
                    </div>
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("description")}
                  >
                    <div className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Description
                      <TableSortIcon
                        active={sortConfig.field === "description"}
                        direction={sortConfig.direction}
                      />
                    </div>
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Category
                      <TableSortIcon
                        active={sortConfig.field === "category"}
                        direction={sortConfig.direction}
                      />
                    </div>
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Type
                      <TableSortIcon
                        active={sortConfig.field === "type"}
                        direction={sortConfig.direction}
                      />
                    </div>
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none text-right"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-end text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Amount
                      <TableSortIcon
                        active={sortConfig.field === "amount"}
                        direction={sortConfig.direction}
                      />
                    </div>
                  </TableHead>

                  <TableHead>
                    <div className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Schedule
                    </div>
                  </TableHead>

                  <TableHead className="w-16 pr-4 text-right">
                    <div className="flex items-center justify-end text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Actions
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAndSortedTransactions.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
                          <ReceiptText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-base font-semibold">
                          No transactions found
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          Try changing your search, amount range, category, or
                          schedule filters.
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            className="mt-4 rounded-xl"
                            onClick={handleClearFilters}
                          >
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Reset filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedTransactions.data.map((transaction) => {
                    const amount = Number(transaction.amount) || 0;
                    const isExpense = transaction.type === "EXPENSE";

                    return (
                      <TableRow
                        key={transaction.id}
                        className={`border-border/60 transition-colors hover:bg-muted/40 ${
                          selectedIds.includes(transaction.id)
                            ? "bg-primary/[0.04]"
                            : ""
                        }`}
                      >
                        <TableCell className="pl-4">
                          <Checkbox
                            checked={selectedIds.includes(transaction.id)}
                            onCheckedChange={() => handleSelect(transaction.id)}
                          />
                        </TableCell>

                        <TableCell className="whitespace-nowrap font-medium text-foreground">
                          {format(new Date(transaction.date), "MMM dd, yyyy")}
                        </TableCell>

                        <TableCell className="max-w-[240px]">
                          <div className="truncate font-medium text-foreground">
                            {transaction.description || "Untitled transaction"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                            style={getCategoryStyle(transaction.category)}
                          >
                            {transaction.category}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1"
                          >
                            {transaction.type}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div
                            className={`font-semibold tracking-tight ${
                              isExpense ? "text-rose-600" : "text-emerald-600"
                            }`}
                          >
                            {isExpense ? "-" : "+"}
                            {formatMoney(amount)}
                          </div>
                        </TableCell>

                        <TableCell>
                          {transaction.isRecurring ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="gap-1.5 rounded-full border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-emerald-700 hover:bg-emerald-500/[0.12] dark:text-emerald-400"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  {RECURRENCE_INTERVALS[
                                    transaction.recurrenceInterval
                                  ] || "Recurring"}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl">
                                <div className="text-sm">
                                  <div className="font-medium">
                                    Next occurrence
                                  </div>
                                  <div className="text-muted-foreground">
                                    {transaction.nextRecurringDate
                                      ? format(
                                          new Date(
                                            transaction.nextRecurringDate,
                                          ),
                                          "MMM dd, yyyy",
                                        )
                                      : "Not available"}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Badge
                              variant="outline"
                              className="gap-1.5 rounded-full px-3 py-1"
                            >
                              <Clock3 className="h-3 w-3" />
                              One-time
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="pr-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-9 w-9 rounded-xl p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-40 rounded-2xl"
                            >
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/transaction/create?edit=${transaction.id}`,
                                    )
                                  }
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuGroup>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => deleteFn([transaction.id])}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalCount > 0 && (
          <div className="flex flex-col gap-4 border-t border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {startIndex}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">{endIndex}</span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalCount}
              </span>{" "}
              transactions
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 rounded-xl p-0"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageItems.map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`h-9 w-9 rounded-xl p-0 ${
                        currentPage === page
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 rounded-xl p-0"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-400" />

          <div className="bg-background px-8 py-7">
            <div className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/50">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>

              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  Delete {selectedIds.length} transaction
                  {selectedIds.length > 1 ? "s" : ""}?
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  This action is permanent and cannot be undone. The selected
                  transaction records will be removed from your history.
                </DialogDescription>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {selectedIds.length}
              </div>
              <p className="text-sm text-muted-foreground">
                transaction{selectedIds.length > 1 ? "s are" : " is"} selected
                for deletion
              </p>
            </div>

            <DialogFooter className="flex flex-row gap-2">
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl"
                onClick={() => setConfirmOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>

              <Button
                className="h-11 flex-1 rounded-xl bg-red-500 text-white hover:bg-red-600"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </span>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionTable;

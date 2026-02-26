"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "../../../../components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "../../../../../data/categories";
import { Badge } from "../../../../components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import useFetch from "../../../../../hooks/use-fetch";
import { bulkDeleteTransactions } from "../../../../../actions/accounts";
import { de } from "date-fns/locale";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const RECURRENCE_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const {
    fn: deleteFn,
    loading: deleteLoading,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const filteredAndSortedTransaction = useMemo(() => {
    let result = [...transactions];

    // search filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (transactions) =>
          transactions.description.toLowerCase().includes(searchLower) ||
          transactions.category.toLowerCase().includes(searchLower) ||
          transactions.amount.toString().includes(searchLower),
      );
    }

    if (recurringFilter) {
      result = result.filter((transactions) => {
        if (recurringFilter === "recurring") {
          return transactions.isRecurring;
        }
        return !transactions.isRecurring;
      });
    }

    if (typeFilter) {
      result = result.filter(
        (transactions) => transactions.type === typeFilter,
      );
    }

    //sorting the elements on the basis of sortConfig
    result.sort((a, b) => {
      let compare = 0;
      switch (sortConfig.field) {
        case "date":
          compare = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          compare = a.amount - b.amount;
          break;
        case "category":
          compare = a.category.localeCompare(b.category);
          break;
        default:
          compare = 0;
      }
      return sortConfig.direction === "asc" ? compare : -compare;
    });
    const totalPages = Math.ceil(result.length / ITEMS_PER_PAGE);
    const paginatedResult = result.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
    return { data: paginatedResult, totalPages, totalCount: result.length };
  }, [
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig,
    currentPage,
  ]);

  // this handles the sorting
  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  console.log(selectedIds);

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item != id)
        : [...current, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransaction.data.length
        ? []
        : filteredAndSortedTransaction.data.map((t) => t.id),
    );
  };

  //   const handleBulkDelete = async () => {
  //     if (
  //       !window.confirm(
  //         `Are you sure you want to delete ${selectedIds.length} transactions?`,
  //       )
  //     ) {
  //       return;
  //     }
  //     deleteFn(selectedIds);
  //   };
  const handleBulkDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    deleteFn(selectedIds);
  };

  //   useEffect(() => {
  //     if (deleted && !deleteLoading) {
  //       toast.success("Transactions Deleted");
  //     }
  //   }, [deleted, deleteLoading]);
  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions Deleted");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, recurringFilter]);
  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color={"#9333ea"} />
      )}
      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5  h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-33.5">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-38.5">
              <SelectValue placeholder="All Recurring" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="non_recurring">Non-Recurring</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                className="ml-2"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>
            </div>
          )}

          {searchTerm || typeFilter || recurringFilter ? (
            <Button
              variant="outline"
              className="ml-2"
              size="sm"
              onClick={handleClearFilters}
              title="Clear Filters"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
      {/* transactions table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-50">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length ===
                      filteredAndSortedTransaction.data.length &&
                    filteredAndSortedTransaction.data.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-50" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransaction.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colspan={7}
                  className={"text-center text-muted-foreground"}
                >
                  No Transaction Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransaction.data.map((transactions) => (
                <TableRow key={transactions.id}>
                  <TableHead className="w-50">
                    <Checkbox
                      onCheckedChange={() => handleSelect(transactions.id)}
                      checked={selectedIds.includes(transactions.id)}
                    />
                  </TableHead>
                  <TableCell>
                    {format(new Date(transactions.date), "PP")}
                  </TableCell>
                  <TableCell>{transactions.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transactions.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transactions.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transactions.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transactions.type === "EXPENSE" ? "-" : "+"}$
                    {transactions.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transactions.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="gap-1 bg-green-100 text-blue-700 hover:bg-green-200"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {
                              RECURRENCE_INTERVALS[
                                transactions.recurrenceInterval
                              ]
                            }
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {" "}
                              {format(
                                new Date(transactions.nextRecurringDate),
                                "PP",
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/transaction/create?edit=${transactions.id}`,
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteFn([transactions.id])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {filteredAndSortedTransaction.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            –{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAndSortedTransaction.totalCount,
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {filteredAndSortedTransaction.totalCount}
            </span>{" "}
            transactions
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-zinc-200 dark:border-zinc-800"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
            </Button>

            {/* Page numbers */}
            {Array.from(
              { length: filteredAndSortedTransaction.totalPages },
              (_, i) => i + 1,
            )
              .filter((page) => {
                return (
                  page === 1 ||
                  page === filteredAndSortedTransaction.totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .reduce((acc, page, idx, arr) => {
                if (idx > 0 && page - arr[idx - 1] > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-8 w-8 flex items-center justify-center text-sm text-zinc-400"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm shadow-green-200 dark:shadow-green-950"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}

            {/* Next */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-zinc-200 dark:border-zinc-800"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(filteredAndSortedTransaction.totalPages, p + 1),
                )
              }
              disabled={currentPage === filteredAndSortedTransaction.totalPages}
            >
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      )}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="p-0 overflow-hidden border-0 shadow-2xl max-w-md">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-400 to-orange-400" />

          <div className="bg-white dark:bg-zinc-950 px-8 py-7">
            {/* Icon + Title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="mt-0.5 flex-shrink-0 h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center border border-red-100 dark:border-red-900">
                <Trash className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Delete {selectedIds.length} transaction
                  {selectedIds.length > 1 ? "s" : ""}?
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  This is permanent and cannot be undone. These records will be
                  removed from your account history.
                </DialogDescription>
              </div>
            </div>

            <div className="mb-6 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs font-bold">
                {selectedIds.length}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                transaction{selectedIds.length > 1 ? "s" : ""} selected for
                deletion
              </span>
            </div>

            {/* Actions */}
            <DialogFooter className="flex flex-row gap-2 sm:gap-2">
              <Button
                variant="outline"
                className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg h-10"
                onClick={() => setConfirmOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white border-0 font-medium shadow-sm shadow-red-200 dark:shadow-red-950 transition-all duration-150"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash className="h-3.5 w-3.5" />
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

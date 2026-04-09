"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../../../lib/utils";

const COLORS = [
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#ec4899", // pink
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f97316", // orange
];

// const DashboardOverview = ({ accounts, transactions }) => {
//   const [selectedAccountId, setSelectedAccountId] = useState(
//     accounts.find((a) => a.isDefault)?.id || accounts[0]?.id,
//   );
const DashboardOverview = ({ accounts = [], transactions = [] }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id || "",
  );
  const [selectedChartAccountId, setSelectedChartAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id || "",
  );
  const [activeIndex, setActiveIndex] = useState(null);

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId,
  );
  const chartTransactions = transactions.filter(
    (t) => t.accountId === selectedChartAccountId,
  );
  const recentTransactions = [...accountTransactions]

    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  // const currentMonthExpenses = accountTransactions.filter((t) => {
  const currentMonthExpenses = chartTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({ name: category, value: amount }),
  );

  const totalExpenses = pieChartData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
          <p className="font-medium capitalize">{item.name}</p>
          <p className="text-muted-foreground">
            ${item.value.toFixed(2)}{" "}
            <span className="text-xs">
              ({((item.value / totalExpenses) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-normal">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon badge */}
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        transaction.type === "EXPENSE"
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-500",
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500",
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Expense Breakdown Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-normal">
              Monthly Expense Breakdown
            </CardTitle>
            {totalExpenses > 0 && (
              <p className="text-2xl font-semibold mt-1">
                ${totalExpenses.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  this month
                </span>
              </p>
            )}
          </div>
          <Select
            value={selectedChartAccountId}
            onValueChange={setSelectedChartAccountId}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pb-4">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No expenses this month
            </p>
          ) : (
            <>
              {/* Donut chart */}
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      strokeWidth={0}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          opacity={
                            activeIndex === null || activeIndex === index
                              ? 1
                              : 0.45
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom legend */}
              <div className="mt-3 space-y-2">
                {pieChartData.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="capitalize text-muted-foreground">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {((entry.value / totalExpenses) * 100).toFixed(1)}%
                      </span>
                      <span className="font-medium w-20 text-right">
                        ${entry.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;

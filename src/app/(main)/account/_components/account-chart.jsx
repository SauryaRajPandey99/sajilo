"use client";

import {
  endOfDay,
  format,
  isSameDay,
  startOfDay,
  subDays,
  eachDayOfInterval,
} from "date-fns";
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet2, CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last 30 Days", days: 30 },
  "3M": { label: "Last 90 Days", days: 90 },
  "6M": { label: "Last 180 Days", days: 180 },
  "1Y": { label: "Last 365 Days", days: 365 },
  ALL: { label: "All Time", days: null },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatCurrencyPrecise = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const income = payload.find((item) => item.dataKey === "income")?.value || 0;
  const expense =
    payload.find((item) => item.dataKey === "expense")?.value || 0;
  const net = income - expense;

  return (
    <div className="min-w-[210px] rounded-2xl border border-white/10 bg-background/95 p-4 shadow-2xl backdrop-blur-xl">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Income</span>
          <span className="font-semibold text-emerald-500">
            {formatCurrencyPrecise(income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Expense</span>
          <span className="font-semibold text-rose-500">
            {formatCurrencyPrecise(expense)}
          </span>
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Net</span>
          <span
            className={`font-semibold ${
              net >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {formatCurrencyPrecise(net)}
          </span>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, tone = "default", subtext }) => {
  const toneMap = {
    positive: "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-500",
    negative: "border-rose-500/20 bg-rose-500/[0.08] text-rose-500",
    neutral: "border-primary/15 bg-primary/[0.06] text-primary",
    default: "border-border bg-muted/40 text-foreground",
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${toneMap[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">
          {value}
        </p>
        {subtext ? (
          <p className="text-xs text-muted-foreground">{subtext}</p>
        ) : null}
      </div>
    </div>
  );
};

const AccountChart = ({ transactions = [] }) => {
  const [dateRange, setDateRange] = useState("1M");

  const { filteredData, totals, insights } = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const cutoffDate = range.days
      ? startOfDay(subDays(now, range.days - 1))
      : startOfDay(new Date(0));

    const relevantTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= cutoffDate && txnDate <= endOfDay(now);
    });

    const dateBuckets =
      range.days !== null
        ? eachDayOfInterval({
            start: cutoffDate,
            end: startOfDay(now),
          })
        : Array.from(
            new Set(
              relevantTransactions.map((txn) =>
                startOfDay(new Date(txn.date)).getTime(),
              ),
            ),
          )
            .sort((a, b) => a - b)
            .map((time) => new Date(time));

    const groupedData = dateBuckets.map((dateObj) => {
      const dayTransactions = relevantTransactions.filter((txn) =>
        isSameDay(new Date(txn.date), dateObj),
      );

      const income = dayTransactions
        .filter((txn) => txn.type === "INCOME")
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

      const expense = dayTransactions
        .filter((txn) => txn.type === "EXPENSE")
        .reduce((sum, txn) => sum + Number(txn.amount), 0);

      return {
        rawDate: dateObj,
        date: format(
          dateObj,
          range.days && range.days <= 30 ? "MMM dd" : "MMM",
        ),
        fullDate: format(dateObj, "MMM dd, yyyy"),
        income,
        expense,
        net: income - expense,
      };
    });

    const totals = groupedData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 },
    );

    const netTotal = totals.income - totals.expense;
    const avgDailyNet =
      groupedData.length > 0 ? netTotal / groupedData.length : 0;

    const highestExpenseDay =
      groupedData.length > 0
        ? groupedData.reduce((max, day) =>
            day.expense > max.expense ? day : max,
          )
        : null;

    return {
      filteredData: groupedData,
      totals,
      insights: {
        netTotal,
        avgDailyNet,
        highestExpenseDay,
      },
    };
  }, [transactions, dateRange]);

  const barRadius = [10, 10, 4, 4];

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary">
              <CalendarDays className="h-3.5 w-3.5" />
              Cashflow analytics
            </div>

            <div>
              <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                Transaction Overview
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Track income, expenses, and net movement across your selected
                period.
              </p>
            </div>
          </div>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-11 w-full rounded-2xl border-border/60 bg-background/80 px-4 shadow-sm sm:w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key} className="rounded-xl">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Income"
            value={formatCurrency(totals.income)}
            icon={TrendingUp}
            tone="positive"
            subtext="Money coming in"
          />
          <StatCard
            label="Total Expense"
            value={formatCurrency(totals.expense)}
            icon={TrendingDown}
            tone="negative"
            subtext="Money going out"
          />
          <StatCard
            label="Net Balance"
            value={formatCurrency(insights.netTotal)}
            icon={Wallet2}
            tone={insights.netTotal >= 0 ? "positive" : "negative"}
            subtext={
              insights.avgDailyNet >= 0
                ? `Avg ${formatCurrency(Math.abs(insights.avgDailyNet))}/day gained`
                : `Avg ${formatCurrency(Math.abs(insights.avgDailyNet))}/day spent`
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              insights.netTotal >= 0
                ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-600"
                : "border-rose-500/20 bg-rose-500/[0.08] text-rose-600"
            }`}
          >
            {insights.netTotal >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {insights.netTotal >= 0 ? "Positive cashflow" : "Negative cashflow"}
          </div>

          {insights.highestExpenseDay?.expense > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
              Highest spend on{" "}
              <span className="font-medium text-foreground">
                {insights.highestExpenseDay.fullDate}
              </span>
            </div>
          ) : null}
        </div>

        <div className="h-[340px] w-full rounded-3xl border border-border/50 bg-background/50 p-4">
          {filteredData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
                <Wallet2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold">No transactions found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                There is no transaction data available for the selected time
                range yet.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                barGap={8}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.35}
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  dy={8}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `$${Math.round(value / 1000)}k`;
                    return `$${value}`;
                  }}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />

                <Tooltip
                  cursor={{
                    fill: "hsl(var(--muted))",
                    opacity: 0.18,
                    radius: 12,
                  }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="income"
                  radius={barRadius}
                  maxBarSize={28}
                  name="Income"
                >
                  {filteredData.map((_, index) => (
                    <Cell key={`income-${index}`} fill="#10b981" />
                  ))}
                </Bar>

                <Bar
                  dataKey="expense"
                  radius={barRadius}
                  maxBarSize={28}
                  name="Expense"
                >
                  {filteredData.map((_, index) => (
                    <Cell key={`expense-${index}`} fill="#f43f5e" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;

import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Wallet2,
  Sparkles,
  Layers3,
  Landmark,
  ShieldCheck,
  Activity,
} from "lucide-react";
import React, { Suspense } from "react";
import {
  getDashboardData,
  getUserAcccounts,
} from "../../../../actions/dashboard";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "../../../../actions/budget";
import BudgetProgress from "./_components/budget-progress";
import DashboardOverview from "./_components/transaction-overview";

async function DashboardPage() {
  // const accounts = await getUserAcccounts();
  const accounts = (await getUserAcccounts()) ?? [];

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  // const transactions = await getDashboardData();
  const transactions = (await getDashboardData()) ?? [];

  const totalAccounts = accounts?.length || 0;
  const totalTransactions = transactions?.length || 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />

        <div className="absolute -left-40 -top-24 h-112 w-md rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[10%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-14rem] left-[30%] h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[20%] h-[24rem] w-[24rem] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      </div>

      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-background/70 shadow-[0_24px_100px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(132,204,22,0.10),transparent_30%,rgba(59,130,246,0.10))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20" />
          <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative grid gap-8 px-6 py-7 md:px-8 md:py-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
            <div className="flex h-full flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-xl dark:bg-white/5">
                <Sparkles className="h-3.5 w-3.5 text-lime-500" />
                Premium finance command center
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl xl:text-6xl">
                Your money,
                <span className="block bg-gradient-to-r from-lime-500 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  beautifully organized
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                A modern personal finance workspace designed to feel sharp,
                calm, and premium. Track accounts, watch budgets, and understand
                activity instantly without the noise.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-xl dark:bg-white/5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Secure account visibility
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-xl dark:bg-white/5">
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                  Real-time financial snapshots
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                icon={
                  <Wallet2 className="h-4 w-4 text-lime-700 dark:text-lime-400" />
                }
                iconWrap="bg-lime-100 dark:bg-lime-950/40"
                label="Accounts"
                value={String(totalAccounts)}
                subtitle="Connected financial spaces"
              />

              <StatCard
                icon={
                  <Layers3 className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                }
                iconWrap="bg-blue-100 dark:bg-blue-950/40"
                label="Transactions"
                value={String(totalTransactions)}
                subtitle="Tracked activity across accounts"
              />

              <StatCard
                icon={
                  <Landmark className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                }
                iconWrap="bg-emerald-100 dark:bg-emerald-950/40"
                label="Default account"
                value={defaultAccount?.name || "Not set"}
                subtitle="Primary account selected"
                valueClassName="text-base sm:text-lg"
              />

              <Card className="overflow-hidden rounded-[26px] border-white/10 bg-white/55 shadow-none backdrop-blur-xl dark:bg-white/5">
                <CardContent className="relative p-5">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20" />
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Experience
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight">
                    Clean. Fast. Premium.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Built with a luxury SaaS visual system instead of generic
                    dashboard styling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-12">
          {/* LEFT */}
          <div className="space-y-6 xl:col-span-8">
            {defaultAccount && (
              <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-background/70 p-2 shadow-[0_14px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(132,204,22,0.05),transparent_50%)]" />
                <div className="relative mb-3 flex items-center justify-between px-4 pt-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Budget intelligence
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Live progress against your active budget
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xl dark:bg-white/5">
                    Active
                  </div>
                </div>

                <BudgetProgress
                  initialBudget={budgetData?.budget}
                  currentExpenses={budgetData?.currentExpense || 0}
                />
              </section>
            )}

            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-background/70 p-2 shadow-[0_14px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(59,130,246,0.05),transparent_55%)]" />
              <div className="relative mb-3 flex items-center justify-between px-4 pt-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Financial overview
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Trends, balances, and activity in one place
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xl dark:bg-white/5">
                  Live data
                </div>
              </div>

              <Suspense
                fallback={
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    Loading overview...
                  </div>
                }
              >
                <DashboardOverview
                  accounts={accounts ?? []}
                  transactions={transactions ?? []}
                />
              </Suspense>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 xl:col-span-4">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-background/70 p-4 shadow-[0_14px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_40%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_40%)]" />

              <div className="relative mb-4">
                <p className="text-sm font-medium text-foreground">
                  Accounts space
                </p>
                <p className="text-xs text-muted-foreground">
                  Create and manage accounts with a premium quick-action panel
                </p>
              </div>

              <CreateAccountDrawer>
                <Card className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-white/55 shadow-none transition-all duration-300 hover:-translate-y-1.5 hover:border-lime-500/30 hover:shadow-[0_22px_60px_rgba(132,204,22,0.16)] dark:bg-white/5">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(132,204,22,0.12),transparent_40%,rgba(59,130,246,0.12))] opacity-80" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute -right-8 top-4 h-24 w-24 rounded-full bg-lime-400/15 blur-2xl" />
                  <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-blue-500/15 blur-2xl" />

                  <CardContent className="relative flex min-h-[250px] flex-col items-center justify-center px-6 py-8 text-center">
                    <div className="mb-5 flex h-18 w-18 items-center justify-center rounded-[24px] bg-gradient-to-br from-lime-500 via-emerald-500 to-blue-500 text-white shadow-[0_18px_40px_rgba(132,204,22,0.28)] transition-transform duration-300 group-hover:scale-105">
                      <Plus className="h-8 w-8" />
                    </div>

                    <p className="text-lg font-semibold tracking-tight text-foreground">
                      Add New Account
                    </p>
                    <p className="mt-2 max-w-[260px] text-sm leading-6 text-muted-foreground">
                      Connect another account and expand your financial command
                      center in seconds.
                    </p>

                    <div className="mt-5 rounded-full border border-white/10 bg-white/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-xl dark:bg-white/5">
                      Quick action
                    </div>
                  </CardContent>
                </Card>
              </CreateAccountDrawer>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-background/70 p-5 shadow-[0_14px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Workspace status
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your dashboard is optimized for visibility, budget tracking,
                    and account control.
                  </p>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Healthy
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <MiniInfoRow
                  title="Accounts linked"
                  value={String(totalAccounts)}
                />
                <MiniInfoRow
                  title="Tracked activity"
                  value={`${totalTransactions} records`}
                />
                <MiniInfoRow
                  title="Primary account"
                  value={defaultAccount?.name || "Unset"}
                />
              </div>
            </section>
          </div>
        </div>

        {/* ACCOUNTS */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Your accounts
              </h2>
              <p className="text-sm text-muted-foreground">
                A refined overview of every account inside your finance
                workspace.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/50 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-xl dark:bg-white/5">
              {totalAccounts} total account{totalAccounts === 1 ? "" : "s"}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {accounts.length > 0 &&
              accounts.map((account) => {
                return <AccountCard key={account.id} account={account} />;
              })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, iconWrap, label, value, subtitle, valueClassName }) {
  return (
    <Card className="overflow-hidden rounded-[26px] border-white/10 bg-white/55 shadow-none backdrop-blur-xl dark:bg-white/5">
      <CardContent className="relative p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20" />
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${iconWrap}`}
        >
          {icon}
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p
          className={`mt-2 line-clamp-1 text-2xl font-semibold tracking-tight text-foreground ${valueClassName || ""}`}
        >
          {value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function MiniInfoRow({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/50 px-4 py-3 backdrop-blur-xl dark:bg-white/5">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="max-w-[55%] truncate text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export default DashboardPage;

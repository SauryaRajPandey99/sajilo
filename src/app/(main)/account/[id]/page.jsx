import React from "react";
import { getAccountWithTransactions } from "../../../../../actions/accounts";
import { notFound } from "next/navigation";

const AccountsPage = async ({ params }) => {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div>
      <div>
        <h1>{account.name}</h1>
        <p>
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>
      <div>
        <div> ${parseFloat(account.balance).toFixed(2)}</div>
        <p>{account._count.transactions}Transactions</p>
      </div>
    </div>
  );
};

export default AccountsPage;

import React from "react";
import { getUserAcccounts } from "../../../../../actions/dashboard";
import { defaultCategories } from "../../../../../data/categories";
import AddTrasactionFrom from "../_components/transaction-form";
import { getTransactions } from "../../../../../actions/transaction";

const AddTransactionPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const account = await getUserAcccounts();

  // Fetch user accounts data
  const editId = resolvedSearchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransactions(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl  mb-8">
        {editId ? "Update" : "Add"} Transaction
      </h1>
      <AddTrasactionFrom
        accounts={account}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />{" "}
      {/* Pass accounts data as prop to the form component */}
    </div>
  );
};

export default AddTransactionPage;

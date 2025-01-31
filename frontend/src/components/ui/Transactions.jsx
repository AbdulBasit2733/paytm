import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkTransactions } from "../../store/user-slice";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Transactions = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState({
    sentTransactions: [],
    receivedTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    dispatch(checkTransactions())
      .unwrap()
      .then((response) => {
        if (response.success) {
          setTransactions({
            sentTransactions: response.data.sentTransactions || [],
            receivedTransactions: response.data.receivedTransactions || [],
          });
          setError("");
        } else {
          setTransactions({ sentTransactions: [], receivedTransactions: [] });
          setError(response.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setError(
          err.message || "Failed to fetch transactions. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const renderTransactionCard = (transaction, type) => (
    <div
      key={transaction._id}
      className="bg-slate-800 shadow-md rounded-lg p-6 mb-4"
    >
      <div className="flex justify-between items-center">
        <div>
          {type === "Received" ? (
            <p className="text-lg font-semibold flex items-center gap-x-2">
              {transaction.receiverUserId.firstname}{" "}
              {transaction.receiverUserId.lastname}
              <ArrowLeft size={14}/>
              {transaction.userId.firstname} {transaction.userId.lastname}{" "}
              
            </p>
          ) : (
            <p className="text-lg font-semibold flex items-center gap-x-2">
              {transaction.userId.firstname} {transaction.userId.lastname}{" "}
              <ArrowRight size={14} />
              {transaction.receiverUserId.firstname}{" "}
              {transaction.receiverUserId.lastname}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {new Date(transaction.transactionDate).toLocaleString()}
          </p>
        </div>
        <div className="text-xl text-center font-bold text-green-600">
          <h1>₹ {transaction.amount.toFixed(2)}</h1>
          <h1 className="text-sm text-slate-300">{type}</h1>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between px-4">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : transactions.sentTransactions.length === 0 &&
        transactions.receivedTransactions.length === 0 ? (
        <div>No Transactions Found</div>
      ) : (
        <>
          {transactions.sentTransactions.map((transaction) =>
            renderTransactionCard(transaction, "Transfer")
          )}
          {transactions.receivedTransactions.map((transaction) =>
            renderTransactionCard(transaction, "Received")
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;

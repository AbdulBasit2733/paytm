import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkTransactions } from "../../store/user-slice";

const Transactions = () => {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalTransactionAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    setIsLoading(true);
    dispatch(checkTransactions())
      .unwrap()
      .then((response) => {
        if (response.success) {
          setTransactions(response.data);
          setIsLoading(false);
        } else {
          setTransactions([]);
          setIsLoading(false);
        }
      });
  }, []);
  return (
    <div className="p-4">
      <div className=" flex justify-between px-4">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        <h2 className="text-2xl font-bold mb-4">Total: ₹{totalTransactionAmount} </h2>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        transactions &&
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-slate-800 shadow-md rounded-lg p-6 mb-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">
                  {transaction.userId.firstname} {transaction.userId.lastname} →{" "}
                  {transaction.receiverUserId.firstname}{" "}
                  {transaction.receiverUserId.lastname}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.transactionDate).toLocaleString()}
                </p>
              </div>
              <div className="text-xl font-bold text-green-600">
                ₹ {transaction.amount.toFixed(2)}
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Sender:</p>
                <p>{transaction.userId.email}</p>
                <p>@{transaction.userId.username}</p>
              </div>
              <div>
                <p className="font-semibold">Receiver:</p>
                <p>{transaction.receiverUserId.email}</p>
                <p>@{transaction.receiverUserId.username}</p>
              </div>
            </div> */}
          </div>
        ))
      )}
    </div>
  );
};

export default Transactions;

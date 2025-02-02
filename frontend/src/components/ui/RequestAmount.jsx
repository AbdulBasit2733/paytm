import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { checkRequests } from "../../store/user-slice";

const RequestAmount = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState({
    sentRequests: [],
    receivedRequests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    dispatch(checkRequests())
      .unwrap()
      .then((response) => {
        console.log(response);
        
        if (response.success) {
          setRequests({
            sentRequests: response.data.sentRequests || [],
            receivedRequests: response.data.receivedRequests || [],
          });
          setError("");
        } else {
          setRequests({ sentRequests: [], receivedRequests: [] });
          setError(response.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setError(
          err.message || "Failed to fetch requests. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const renderRequestCard = (request, type) => (
    <div key={request._id} className="bg-slate-800 shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center">
        <div>
          {type === "Received" ? (
            <p className="text-lg font-semibold flex items-center gap-x-2">
              {request.requestedUserId.firstname}{" "}
              {request.requestedUserId.lastname}
              <ArrowLeft size={14} />
              {request.userId.firstname} {request.userId.lastname}{" "}
            </p>
          ) : (
            <p className="text-lg font-semibold flex items-center gap-x-2">
              {request.userId.firstname} {request.userId.lastname}{" "}
              <ArrowRight size={14} />
              {request.requestedUserId.firstname}{" "}
              {request.requestedUserId.lastname}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-xl text-center font-bold">
          <h1 className="text-green-600">₹ {request.amount.toFixed(2)}</h1>
          <h1 className={`text-sm ${request.status === "Pending" ? "text-yellow-400" : request.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
            {request.status}
          </h1>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-gray-300">{error}</div>
      ) : requests.sentRequests.length === 0 &&
        requests.receivedRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-300">No Requests Found</div>
      ) : (
        <>
          {requests.sentRequests.map((request) => renderRequestCard(request, "Sent"))}
          {requests.receivedRequests.map((request) => renderRequestCard(request, "Received"))}
        </>
      )}
    </div>
  );
};

export default RequestAmount;

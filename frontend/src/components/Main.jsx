import { useEffect, useState } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../store/user-slice";
import Form from "./Form";
import { checkAuth } from "../store/auth-slice";

const Main = () => {
  const { isLoading, allUsers } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recieverId, setRecieverId] = useState();
  const [type, setType] = useState();
  console.log(type);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header username={user?.userId?.username} />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4">Account Balance</h2>
            <p className="text-4xl font-bold mb-4">{user?.balance} Rs</p>
            <button
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-md font-semibold transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => {
                setIsModalOpen(true);
                setType("add_balance");
                
              }}
            >
              Add Balance
            </button>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setType("send_money");
                }}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-md font-semibold transition duration-300 ease-in-out transform hover:scale-105"
              >
                Send Money
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setType("request_money");
                }}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold transition duration-300 ease-in-out transform hover:scale-105"
              >
                Request Money
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-6">Users</h2>
          {allUsers && allUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-300">No Users Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers &&
                    allUsers.map((user) => (
                      
                      <tr
                        key={user._id}
                        className="border-b border-gray-700 hover:bg-blue-800 transition duration-300"
                      >
                        <td className="py-3 px-4">{user._id}</td>
                        <td className="py-3 px-4">
                          {user.firstname} {user.lastname}
                        </td>
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setType("send_money");
                              setRecieverId(user._id)
                            }}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            Send Money
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {type === "add_balance"
                ? "Add Balance"
                : type === "send_money"
                ? "Send Money"
                : "Request Money"}
            </h2>
            <Form onClose={closeModal} type={type} recieverId={recieverId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;

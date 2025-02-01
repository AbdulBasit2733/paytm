import React, { useEffect, useState } from "react";
import { Search, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../store/user-slice/index";

const UsersCompo = ({ setIsModalOpen, setType, setRecieverId }) => {
  const dispatch = useDispatch();
  const { isLoading, allUsers } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-300">Loading Users...</div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between w-[25rem] border rounded-md pr-4 pl-2 py-3">
        <input
          type="text"
          placeholder="Enter Firstname Or Lastname"
          className="w-full outline-none  bg-transparent"
        />
        <button>
          <Search />
        </button>
      </div>
      {allUsers?.length == 0 ? (
        <div className="text-center py-8 text-gray-300">No Users Found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                {/* <th className="py-3 px-4">Image</th> */}
                {/* <th className="py-3 px-4">ID</th> */}
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {allUsers &&
                allUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 last:border-b-0"
                  >
                    {/* <td className="py-3 px-4 ">
                      
                    </td> */}
                    {/* <td className="py-3 px-4">{index + 1}</td> */}
                    <td className="py-3 px-4 flex items-center">
                      <div className="rounded-full w-10 h-10 flex items-center justify-center border-none mr-3 bg-indigo-500">
                        {user.firstname[0].toUpperCase()}
                      </div>
                      <div className="capitalize">
                        {user.firstname} {user.lastname}
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setType("send_money");
                          setRecieverId(user._id);
                        }}
                        className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 w-full sm:w-auto flex items-center justify-center gap-x-2 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out hover:gap-x-4"
                      >
                        <Send className="w-4 h-4" />
                        Send Money
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UsersCompo;

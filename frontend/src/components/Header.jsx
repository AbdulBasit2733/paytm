import React from "react";
import { useDispatch } from "react-redux";
import { logoutFromServer } from "../store/auth-slice";
import { toast } from "react-toastify";

const Header = ({ username }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutFromServer()).then((data) => {
      if (data.payload.success) {
        toast.success(data.payload.message);
      } else {
        toast.error(data.payload.message);
      }
    });
  };
  return (
    <header className=" p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">PaytmClone</h1>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center gap-2 space-x-4 font-bold">
            Hello,
            <span className="capitalize tracking-wide">{username}</span>
          </div>
          <div className="flex items-center gap-2 space-x-4 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-bell"
            >
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-700 text-white px-4 py-3 rounded-md w-[8rem] flex items-center gap-x-2 hover:gap-x-4 hover:bg-black transition-all ease-in-out duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

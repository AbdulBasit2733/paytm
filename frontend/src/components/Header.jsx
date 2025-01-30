import React from "react";
import { useDispatch } from "react-redux";
import { logoutFromServer } from "../store/auth-slice";
import { toast } from "react-toastify";

const Header = ({ username }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutFromServer()).then((data) => {
      console.log(data.payload);
      if(data.payload.success){
        toast.success(data.payload.message)
      }else{
        toast.error(data.payload.message)
      }
    });
  };
  return (
    <header className=" p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">PaytmClone</h1>
        <div className="flex items-center space-x-4">
          <span>{username}</span>
          <button
            onClick={handleLogout}
            className="bg-slate-950 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

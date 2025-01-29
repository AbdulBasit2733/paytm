import React from "react";

const Header = ({ username, onLogout }) => {
  return (
    <header className=" p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">PaytmClone</h1>
        <div className="flex items-center space-x-4">
          <span>{username}</span>
          <button
            onClick={onLogout}
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

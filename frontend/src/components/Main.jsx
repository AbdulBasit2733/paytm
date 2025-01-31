import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Users, ArrowRightLeft, Plus, Send, GitPullRequestArrow } from "lucide-react";
import Header from "./Header";
import { fetchAllUsers } from "../store/user-slice/index";
import Form from "./Form";
import Transactions from "./ui/Transactions";
import UsersCompo from "./ui/UsersCompo";
import RequestAmount from "./ui/RequestAmount";

const AnimatedTabButton = ({ isSelected, onClick, icon, label }) => (
  <motion.button
    onClick={onClick}
    className={`text-sm md:text-base font-bold flex items-center gap-2 py-2 px-4 relative`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{ scale: isSelected ? 1.05 : 1 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    {icon}
    {label}
    {isSelected && (
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
        layoutId="underline"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    )}
  </motion.button>
);

const Main = () => {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recieverId, setRecieverId] = useState();
  const [selected, setSelected] = useState("users");
  const [type, setType] = useState();

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header username={user?.userId?.username} />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4">Account Balance</h2>
            <p className="text-4xl font-bold mb-4">₹ {user?.balance}</p>
            <button
              className="px-6 py-3 flex items-center gap-x-2 w-full sm:w-auto hover:gap-x-4 bg-green-500 hover:bg-green-600 rounded-md font-semibold transition-all duration-300 ease-in-out"
              onClick={() => {
                setIsModalOpen(true);
                setType("add_balance");
              }}
            >
              <Plus className="w-6 h-6" />
              Add Balance
            </button>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setType("send_money");
                }}
                className="px-4 py-3 flex items-center justify-center gap-x-2 hover:gap-x-5 w-full bg-purple-500 hover:bg-purple-600 rounded-md font-semibold transition-all duration-300 ease-in-out"
              >
                <Send className="w-6 h-6" />
                Send Money
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
          <div className="flex items-center gap-x-4 sm:gap-x-10 mb-6 overflow-x-auto pb-2">
            <AnimatedTabButton
              isSelected={selected === "users"}
              onClick={() => setSelected("users")}
              icon={<Users className="w-6 h-6" />}
              label="Users"
            />
            <AnimatedTabButton
              isSelected={selected === "transactions"}
              onClick={() => setSelected("transactions")}
              icon={<ArrowRightLeft className="w-6 h-6" />}
              label="Transactions"
            />
            <AnimatedTabButton
              isSelected={selected === "request"}
              onClick={() => setSelected("request")}
              icon={<GitPullRequestArrow className="w-6 h-6" />}
              label="Request"
            />
          </div>
          {selected === "users" ? (
            <UsersCompo
              setIsModalOpen={setIsModalOpen}
              setType={setType}
              setRecieverId={setRecieverId}
            />
          ) : selected === "transactions" ?  (
            <Transactions />
          ) : <RequestAmount /> }
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full">
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

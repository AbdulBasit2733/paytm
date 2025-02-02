import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBalance, sendMoney, requestMoney } from "../store/user-slice/index";
import { toast } from "react-toastify";
import { checkAuth } from "../store/auth-slice";

const UserSearchInput = ({
  label,
  value,
  onChange,
  filteredUsers,
  onSelect,
}) => (
  <div className="relative">
    <label
      htmlFor={label.toLowerCase()}
      className="block text-sm font-medium text-gray-700"
    >
      {label}
    </label>
    <input
      type="text"
      id={label.toLowerCase()}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm text-slate-950 outline-none"
      placeholder="Search by name or username"
    />
    {filteredUsers.length > 0 && (
      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-slate-950 flex items-center"
            onClick={() => onSelect(user)}
          >
            <div className="rounded-full w-10 h-10 flex items-center justify-center border mr-3 bg-gray-200">
              {user.firstname[0].toUpperCase()}
            </div>
            <div>
              {user.firstname} {user.lastname}{" "}
              <span className="text-gray-500">({user.username})</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AmountInput = ({ amountRef }) => (
  <div className="mt-2">
    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
      Amount
    </label>
    <input
      type="number"
      id="amount"
      ref={amountRef}
      className="mt-2 py-2 px-3 block w-full rounded-md shadow-sm outline-none border text-slate-950"
      placeholder="Enter amount"
      required
    />
  </div>
);

const Form = ({ onClose, type, recieverId }) => {
  const { allUsers } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [recipient, setRecipient] = useState("");
  const [recipientId, setRecipientId] = useState(recieverId || ""); // Default to recieverId if provided
  const [requestTo, setRequestTo] = useState("");
  const [requestToId, setRequestToId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const amountRef = useRef();
  const descriptionRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (recieverId) {
      // Auto-fill recipient name based on recieverId
      const foundUser = allUsers.find((u) => u._id === recieverId);
      if (foundUser) {
        setRecipient(`${foundUser.firstname} ${foundUser.lastname}`);
        setRecipientId(foundUser._id);
      }
    }
  }, [recieverId, allUsers]);

  useEffect(() => {
    const searchTerm = type === "send_money" ? recipient : requestTo;
    if (searchTerm) {
      const filtered = allUsers.filter(
        (user) =>
          user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [recipient, requestTo, allUsers, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(amountRef.current.value);
    switch (type) {
      case "add_balance":
        dispatch(addBalance({ amount })).then((data) => {
          if (data.payload.success) {
            toast.success(data.payload.message);
            dispatch(checkAuth());
          } else {
            toast.error(data.payload.message);
          }
        });
        break;
      case "send_money":
        
        if (!recipientId) {
          toast.error("Please select a recipient");
          return;
        }
        dispatch(sendMoney({ recipientId, amount })).then((data) => {
          if (data.payload.success) {
            toast.success(data.payload.message);
            dispatch(checkAuth());
          } else {
            toast.error(data.payload.message);
          }
        });
        break;
      case "request_money":
        const description = descriptionRef.current.value;
        dispatch(requestMoney({ requestToId, amount, description })).then(
          (data) => {
            if (data.payload.success) {
              toast.success(data.payload.message);
              dispatch(checkAuth());
            } else {
              toast.error(data.payload.message);
            }
          }
        );
        break;
      default:
        console.error("Unknown form type");
    }
    onClose();
  };

  const handleUserSelect = (user) => {
    const fullName = `${user.firstname} ${user.lastname}`;
    if (type === "send_money") {
      setRecipient(fullName);
      setRecipientId(user._id);
    } else if (type === "request_money") {
      setRequestTo(fullName);
      setRequestToId(user._id);
    } else {
      setRequestTo(fullName);
    }
    setFilteredUsers([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "add_balance" && <AmountInput amountRef={amountRef} />}
      {type === "send_money" && (
        <>
          <UserSearchInput
            label="Recipient"
            value={recipient}
            onChange={setRecipient}
            filteredUsers={filteredUsers}
            onSelect={handleUserSelect}
          />
          <AmountInput amountRef={amountRef} />
        </>
      )}
      {type === "request_money" && (
        <>
          <UserSearchInput
            label="Request To"
            value={requestTo}
            onChange={setRequestTo}
            filteredUsers={filteredUsers}
            onSelect={handleUserSelect}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              ref={descriptionRef}
              className="mt-1 py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm text-slate-950 outline-none"
              placeholder="Search by name or username"
            />
          </div>
          <AmountInput amountRef={amountRef} />
        </>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          {type === "add_balance"
            ? "Add Balance"
            : type === "send_money"
            ? "Send Money"
            : "Request Money"}
        </button>
      </div>
    </form>
  );
};

export default Form;

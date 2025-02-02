const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});
const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverUserId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  // transactionType: {
  //   type: String,
  //   enum: ["credit", "debit"],
  //   required: true,
  // },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  receiverAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
});
const RequestMoneySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
  status:{
    type:String,
    enum:["Paid", "Pending"],
    required:true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const AccountModel = mongoose.model("Account", AccountSchema);
const RequestMoneyModel = mongoose.model("Request", RequestMoneySchema);
const TransactionModel = mongoose.model("Transaction", TransactionSchema);
const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel, AccountModel,TransactionModel, RequestMoneyModel };

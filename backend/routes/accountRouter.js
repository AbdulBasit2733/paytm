const express = require("express");
const mongoose = require("mongoose");
const { UserModel, AccountModel, TransactionModel } = require("../db");
const AuthMiddleware = require("../middleware/middleware");

const router = express.Router();

router.get("/balance", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId._id;
    const userBalance = await AccountModel.findOne({
      userId: userId,
    });

    if (!userBalance) {
      return res.status(400).json({
        success: false,
        message: "Balance Not Found, Please Add Some Amount",
      });
    }

    res.status(200).json({
      success: false,
      message: "Balance Fetched Successfully",
      data: userBalance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/add-balance", AuthMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId._id;
    const { amount } = req.body;
    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Amount must be a positive number.",
      });
    }

    // Check if user exists
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Find and update the account balance, create if it doesn't exist
    const account = await AccountModel.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `${amount} rupees have been added to your account.`,
      balance: account.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error adding balance:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    session.endSession();
  }
});

router.post("/transfer-funds", AuthMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromAccountUserId = req.user.userId._id;
    const { recipientId: toAccountUserId, amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Must be a positive number.",
      });
    }

    const senderAccount = await AccountModel.findOne({
      userId: fromAccountUserId,
    }).session(session);
    if (!senderAccount) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Sender account not found." });
    }

    if (senderAccount.balance < amount) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance." });
    }

    if (!mongoose.Types.ObjectId.isValid(toAccountUserId)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Invalid recipient ID." });
    }

    const receiverAccount = await AccountModel.findOne({
      userId: toAccountUserId,
    }).session(session);
    if (!receiverAccount) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Recipient account not found." });
    }

    // Deduct from sender
    await AccountModel.updateOne(
      { userId: fromAccountUserId },
      { $inc: { balance: -amount } },
      { session }
    );

    await AccountModel.updateOne(
      { userId: toAccountUserId },
      { $inc: { balance: amount } },
      { session }
    );

    await TransactionModel.create(
      [
        {
          userId: fromAccountUserId,
          receiverUserId: toAccountUserId,
          amount: amount,
          receiverAccountId: receiverAccount._id,
        },
      ],
      {
        session: session,
      }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `${amount} rupees transferred successfully.`,
    });
  } catch (error) {
    console.error("Error transferring funds:", error);
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Internal Server Error." });
  } finally {
    session.endSession();
  }
});
router.get("/check-transactions", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId._id;

    const sentTransactions = await TransactionModel.find({ userId })
      .populate("userId", "-password")
      .populate("receiverUserId", "-password")
      .populate("receiverAccountId");

    // Find transactions where the user is the receiver
    const receivedTransactions = await TransactionModel.find({
      receiverUserId: userId,
    })
      .populate("userId", "-password")
      .populate("receiverUserId", "-password")
      .populate("receiverAccountId");

    if (sentTransactions.length === 0 && receivedTransactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { sentTransactions, receivedTransactions },
      message: "Transactions fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
});

module.exports = router;

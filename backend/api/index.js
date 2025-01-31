const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Handle Preflight Requests
app.options("*", cors());

const mainRouter = require("../routes/mainRouter");
app.use("/api/v1", mainRouter);

async function Main() {
  mongoose
    .connect(`${process.env.MONGODB_URL}`, {
      dbName: "paytm",
    })
    .then(() => {
      console.log("DB is Connected");
      app.listen(3001, () => {
        console.log("App is running on port 3001");
      });
    })
    .catch((error) => {
      console.log("MongoDB Connection Error:", error);
    });
}

Main();

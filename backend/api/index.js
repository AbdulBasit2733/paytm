const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight request
  }
  next();
});

app.use(cookieParser());

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
        console.log("App is running");
      });
    })
    .catch((error) => {
      console.log("MongoDB Connection Error:", error);
    });
}

Main();

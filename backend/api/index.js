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
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ], // Allowed headers in the request
    credentials: true, // Allows cookies to be sent
    preflightContinue: false, // Automatically handle preflight requests
    optionsSuccessStatus: 200, // For legacy browsers (preflight requests might expect 200)
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
        console.log("App is running");
      });
    })
    .catch((error) => {
      console.log("MongoDB Connection Error:", error);
    });
}

Main();

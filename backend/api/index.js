const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.options("*", cors());
app.use(cookieParser());


app.use(
  cors({
    origin: ["https://paytm-frontend-ruddy.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ], // Allowed headers in the request
    preflightContinue: false, // Automatically handle preflight requests
    optionsSuccessStatus: 200, // For legacy browsers (preflight requests might expect 200)
  })
);

app.use(express.urlencoded({ extended: true }));

// Handle Preflight Requests

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

module.exports = app;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.options("*", cors());
app.use(cookieParser());

const allowedOrigins = ["https://paytm-frontend-ruddy.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowedOrigins array
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Block the origin
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers)
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// Handle Preflight Requests

const mainRouter = require("./routes/mainRouter");
app.use("/api/v1", mainRouter);

async function Main() {
  mongoose
    .connect(`${process.env.MONGODB_URL}`, {
      dbName: "paytm",
    })
    .then(() => {
      console.log("DB is Connected");
      app.listen(PORT, () => {
        console.log("App is running on port 3001");
      });
    })
    .catch((error) => {
      console.log("MongoDB Connection Error:", error);
    });
}

Main();

module.exports = app;

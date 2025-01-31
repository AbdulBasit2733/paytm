const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT= process.env.PORT
const app = express();
app.use(express.json());
app.options("*", cors());
app.use(cookieParser());

const allowedOrigins = ['https://paytm-frontend-ruddy.vercel.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allows credentials (cookies, authorization headers)
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

app.use(express.urlencoded({ extended: true }));

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

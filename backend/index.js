const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const mainRouter = require("./routes/mainRouter");

app.use("/api/v1", mainRouter);

async function Main() {
  try {
    mongoose.connect("mongodb://localhost:27017/paytm").then(() => {
      console.log("DB is Connected");
      app.listen(3001, () => {
        console.log("App is running");
      });
    });
  } catch (error) {
    console.log(error);
  }
}

Main();

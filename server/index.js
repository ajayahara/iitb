require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Connected To Server" });
});

app.use("/api/users", userRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Connected to Db`);
  } catch (error) {
    console.log("Error in connecting to Db");
  }
});

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = 3001;

mongoose.connect("mongodb://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send(200);
});

app.get("/users", async (req, res) => {
  let users = await User.find({});

  res.send({ count: users.length, users: users });
});

app.get("/users:username", async (req, res) => {
  let users = await User.find({ username: req.params.username });

  res.send({ count: users.length, users: users });
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

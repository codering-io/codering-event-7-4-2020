const express = require('express');
const mongoose = require('mongoose');
const User = require("./models/User");

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://localhost:27017/coderingevent1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res) => {
  res.send(200);
});

app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send({ count: users.length, users: users });
});

app.get("/users/:username", function(req, res) => {
  User.findOne({ username: req.params.username }, async (err, result) => {
    if (err) throw err;
    if (!result) return res.send('User not found.')
    if (result) return res.send(result);
  });
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

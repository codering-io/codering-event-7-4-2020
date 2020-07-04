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

app.get("/users", (req, res) => {
  User.find({}, (error, results) => {
    if (error) res.send({ message: "An error occured", error: error.stack });

    res.send(results);
  });
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));
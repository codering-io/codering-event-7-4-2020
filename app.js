const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://localhost:27017/coderingevent1', {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

app.get('/', (req, res) => {
  res.send(200);
});

app.get('/users', (req, res) => {
  User.find({}, function(err, result) {
    if (err) throw err;
    res.json(result);
  })
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));
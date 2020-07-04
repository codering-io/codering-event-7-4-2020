const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

const users = require('./models/User');

mongoose.connect('mongodb://localhost:27017/coderingevent1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.get('/', (req, res) => {
  res.send(200);
});

app.post('/users/', async (req, res) => {
    if (req.body.username && req.body.password && req.body.email) {
        var existing = await users.findOne({ email: req.body.email });
        if (existing) return;
        var newUser = new users({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        await newUser.save();
    }
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

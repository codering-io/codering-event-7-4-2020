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

app.get(["/users", "/users/:username"], async (req, res) => {
  let { username } = req.params;

  if (username) {
    let user = await User.findOne({ username: username });

    return res.send(user === null ? { error: `No user with the name: ${username} can be found.` } : user);
  };

  let users = await User.find({});

  res.send({ count: users.length, users: users });
});

app.post('/users', async(req, res) => {
    const newUser = new User({
      username: 'stuy',
      password: 123456,
      email: 'stuy@gmail.com',
    });
    newUser.save().then(e => {
      return res.send(`Error: ${e}`);
    });
    return res.send('Success: Created new user.');
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));
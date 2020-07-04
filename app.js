const express = require('express');
const mongoose = require('mongoose');
const User = require("./models/User");

const app = express();
const PORT = 3001;

mongoose.connect("mongodb://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(express.json(), express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(200);
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.send({ count: users.length, users: users });
});

app.get('/users/:username', async (req, res) => {
  User.findOne({ username: req.params.username }, async (err, result) => {
    if (err) throw err;
    if (!result) return res.send('User not found.')
    if (result) return res.send(result);
  });
});

app.post('/users', function(req, res) {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })
  return newUser.save().then(() => res.send(`Added user: ${req.body.username} into the database.`));
});

app.put('/users/:usernameOrEmail/:username', function(req, res) {
  User.findOne({ username: req.params.usernameOrEmail }, async function(err, result) {
    if (err) throw err;
    if (result) {
      await User.updateOne(result, { username: req.params.username })
        .then(() => res.send(`Updated username to ${req.params.username}`));
    }
    if (!result) {
      User.findOne({ email : req.params.usernameOrEmail }, async function(err, result) {
        if (err) throw err;
        if (!result) return res.send('Invalid User');
        if (result) {
          await User.updateOne(result, { username: req.params.username })
            .then(() => res.send(`Updated username to ${req.params.username}`));
        }
      })
    }
  })
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

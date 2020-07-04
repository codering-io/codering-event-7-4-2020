const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
const PORT = 3001;

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
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

app.put('/users/:usernameOrEmail/username', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.send({ error: 400, message: "No username was inputted." });

  const user = await User.findOne({ username: req.params.usernameOrEmail }) || await User.findOne({ email: req.params.usernameOrEmail });

  if (await User.findOne({ username: username })) return res.send({ error: 400, message: "Sorry but someone already has that name." });
  await user.updateOne({ username: username });

  res.send({ newName: username });
});

app.post("/users", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.send({ error: 400, message: "Sorry. But it seems you are missing a piece of information." });

  const user = new User({ username: username, password: password, email: email });
  await user.save();

  res.send(user);
});

app.get("/posts", async (req, res) => {
  let posts = await Post.find({});

  res.send({ count: posts.length, posts: posts });
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

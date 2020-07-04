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

app.get("/users", async (req, res) => {
  const all = await User.find().select("-password");
  res.send(all);
});

app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select("-password");
  if (!user) return res.status(400).send("No user found!");
  res.send(user);
});

app.post("/users", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(404).send("Provide a username, email, and password!");
  }

  const test = new User({ username, email, password });
  await test.save();
  res.send(test);
});

app.put("/users/:user/username", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.user);
  if (!findUser) return res.status(400).send("No user found!");

  const { username } = req.body;
  if (!username) return res.status(404).send("Please provide a username!");

  const checkName = await User.findOne({ email });
  if (checkName) return res.send("You cannot use this email!");

  await findUser.updateOne({ username });
  res.sendStatus(200);
});

app.put("/users/:user/email", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.user);
  if (!findUser) return res.status(400).send("No user found!");

  const { email } = req.body;
  if (!email) return res.status(404).send("Please provide a email!");

  const checkEmail = await User.findOne({ email });
  if (checkEmail) return res.send("You cannot use this email!");

  await findUser.updateOne({ email });
  res.sendStatus(200);
});

app.delete("/users/:user", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.user);
  if (!findUser) return res.status(400).send("No user found!");
  res.send(await findUser.deleteOne());
});

app.get("/posts", async (req, res) => {
  let posts = await Post.find({});

  res.send({ count: posts.length, posts: posts });
});

app.listen(PORT, () => {
  console.log(`Server is listening to requests on Port ${PORT}`)
});

// Find a user by email or username
async function findNameOrEmail(value) {
  const findName = await User.findOne({ username: value });
  if (findName) return findName;
  const findEmail = await User.findOne({ email: value });
  if (findEmail) return findEmail;
  return null;
}

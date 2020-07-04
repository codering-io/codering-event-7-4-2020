const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
const PORT = 3001;

app.use(express.json());

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
  }

  let users = await User.find({});

  res.send({ count: users.length, users: users });
});

app.put("/users/:usernameOrEmail/username", async (req, res) => {
  const { username } = req.body;
  const { usernameOrEmail } = req.params;

  if (!username) return res.send({ error: 400, message: "No username was inputted." });

  const user = await findNameOrEmail(usernameOrEmail);

  if (await User.findOne({ username: username })) return res.send({ error: 400, message: "Sorry but someone already has that name." });
  await user.updateOne({ username: username });

  res.send({ newName: username });
});

app.put("/users/:usernameOrEmail/email", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.usernameOrEmail);
  if (!findUser) return res.status(400).send("No user found!");

  const { email } = req.body;
  if (!email) return res.status(404).send("Please provide a email!");

  const checkEmail = await User.findOne({ email });
  if (checkEmail) return res.send("You cannot use this email!");

  await findUser.updateOne({ email });
  res.sendStatus(200);
});

app.post("/users", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.send({ error: 400, message: "Sorry. But it seems you are missing a piece of information." });

  const user = new User({ username: username, password: password, email: email });
  await user.save();

  res.send(user);
});

app.post("/friends/:username", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.send({ error: 404, message: "You need a friend username." });
  if (!req.params.username) return res.send({ error: 404, message: "You need a username." });
  const foundUser = await User.findOne({ username: req.params.username });
  if (!foundUser) return res.send({ error: 404, message: "User does not exist." });
  foundUser.friends.push(username);
  await foundUser.save();
  res.send(foundUser);
});

app.delete("/users/:usernameOrEmail", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.usernameOrEmail);
  if (!findUser) return res.status(400).send("No user found!");
  res.send(await findUser.deleteOne());
});

app.get("/posts", async (req, res) => {
  let posts = await Post.find({});

  res.send({ count: posts.length, posts: posts });
});

app.get("/posts/:usernameOrEmail", async (req, res) => {
  let { usernameOrEmail } = req.params;
  let user = await findNameOrEmail(usernameOrEmail);
  if (!user || user === null) return res.send({ error: 400, message: "Sorry but this user doesn't exist in our database" });
  let posts = await Post.find({ author: user.username });
  return res.send(posts);
});

app.post("/posts", async (req, res) => {
  const {
    username,
    email,
    post: { title, content },
  } = req.body;
  if (!username || !email || !title || !content) return res.send({ error: 400, message: "Sorry. But it seems you are missing a piece of information." });

  let user = await findNameOrEmail(username);
  if (user === null) return res.send({ error: 400, message: "Sorry but this user doesn't exist in our database" });
  if (user.email !== email) return res.send({ error: 401, message: "Sorry but the email does not correspond to the user." });

  const post = new Post({ title: title, content: content, author: username, createdOn: new Date(), editedOn: null });
  await post.save();

  res.send(post);
});

app.get("/friends/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.find({ username: username });
  res.send({ count: user[0].friends.length, friends: user[0].friends });
});

app.listen(PORT, () => {
  console.log(`Server is listening to requests on Port ${PORT}`);
});

// Find a user by email or username
async function findNameOrEmail(value) {
  const findName = await User.findOne({ username: value });
  if (findName) return findName;
  const findEmail = await User.findOne({ email: value });
  if (findEmail) return findEmail;
  return null;
}

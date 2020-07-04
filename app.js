const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use("/users", usersRouter);

mongoose.connect("mongodb://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

app.listen(PORT, () => {
  console.log(`Server is listening to requests on Port ${PORT}`);
});

// Find a user by email or username

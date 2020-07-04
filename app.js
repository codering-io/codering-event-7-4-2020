const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const usersRouter = require("./routes/users")

const app = express();
const PORT = 3001;

app.use(express.json())
app.use("/users", usersRouter)

mongoose.connect("mongodb://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/posts", async (req, res) => {
  let posts = await Post.find({});

  res.send({ count: posts.length, posts: posts });
});

app.get("/friends/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.find({ username: username });
  res.send({ count: user.friends.length, friends: user.friends });
});

app.listen(PORT, () => {
  console.log(`Server is listening to requests on Port ${PORT}`);
});

// Find a user by email or username


const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const usersRouter = require("./routes/users")

const app = express();
const PORT = 3001;

app.use(express.json())
app.use("/users", usersRouter)

mongoose.connect("mongodb+srv://admin:hexmadrocks50@testinggrounds.j92jh.mongodb.net/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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


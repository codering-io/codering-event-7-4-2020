const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const usersRouter = require("./routes/users")
const postsRouter = require("./routes/posts")

const app = express();
const PORT = 3001;

app.use(express.json())
app.use("/users", usersRouter)
app.use("/posts", postsRouter)


mongoose.connect("mongodb://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/friends/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  res.send({ count: user.friends.length, friends: user.friends });
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

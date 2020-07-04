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

app.delete("/users/:usernameOrEmail", async (req, res) => {
  const { usernameOrEmail } = req.params;

  if (usernameOrEmail) {
    const user = await User.findOneAndDelete({ username: usernameOrEmail })
    if (user === null) {
      const email = await User.findOneAndDelete({ email: usernameOrEmail})
      return res.send(email === null ? { error: 400, message: `No user with the email or username: ${usernameOrEmail} can be found.` } : email)
    }
    return res.send(user)
  }
  res.send(400)

})

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

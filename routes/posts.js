const router = require('express').Router();
const User = require("../models/User")
const Post = require("../models/Post")
const findNameOrEmail = require("../util/findNameOrEmail")
const { findByIdAndUpdate } = require("../models/Post");

router.route("/").get( async (req, res) => {
  let posts = await Post.find({});

  res.send({ count: posts.length, posts: posts });
})

router.route("/:usernameOrEmail").get( async (req, res) => {
  let { usernameOrEmail } = req.params;
  let user = await findNameOrEmail(usernameOrEmail)
  if (!user || user === null) return res.send({ error: 400, message: "Sorry but this user doesn't exist in our database" });
  let posts = await Post.find({ author: user.username });
  return res.send(posts);
})

router.route("/").post( async (req, res) => {
  const { username, email, post: { title, content } } = req.body;
  if (!username || !email || !title || !content) return res.send({ error: 400, message: "Sorry. But it seems you are missing a piece of information." });

  let user = await findNameOrEmail(username);
  if (user === null) return res.send({ error: 400, message: "Sorry but this user doesn't exist in our database" });
  if (user.email !== email) return res.send({ error: 401, message: "Sorry but the email does not correspond to the user." });

  const post = new Post({ title: title, content: content, author: username, createdOn: new Date(), editedOn: null });
  await post.save();

  res.send(post);
})

router.route("/:id").put( async (req, res) => {
  const { id } = req.params;
  if (!id) return res.sendStatus(400).send({ error: 400, message: "No id was provided."})
  const { title, content } = req.body;
  let user;
  if (title && !content) {
    user = await Post.findById(id);
    user.updateOne({ title })
    return res.send({ newTitle: title })
  }
  if (!title && content) {
    user = await Post.findById(id);
    user.updateOne({ content })
    return res.send({ newContent: content })
  }
  if (title && content) {
    user = await Post.findById(id);
    user.updateOne({ title: title, content: content })
    return res.send({ newTitle: title, newContent: content})
  }
  
  return res.send({ error: 400, message: "You need to supply either a title or content, or both." })
})

module.exports = router
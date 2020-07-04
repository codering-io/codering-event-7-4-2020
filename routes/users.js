const router = require('express').Router();
const User = require("../models/User")
const findNameOrEmail = require("../util/findNameOrEmail");
const Post = require('../models/Post');

router.route(['/', '/:username']).get(async(req, res) => {
  let { username } = req.params;

  if (username) {
    let user = await User.findOne({ username: username });

    return res.send(user === null ? { error: `No user with the name: ${username} can be found.` } : user);
  };

  let users = await User.find({});

  res.send({ count: users.length, users: users });
})

router.route('/:usernameOrEmail/username').put(async(req, res) => {
  const user = await findNameOrEmail(req.params.usernameOrEmail);
  if (!user) return res.status(400).send("No user found!")

  const { username } = req.body;
  if (!username) return res.send({ error: 400, message: "Please provide a username." });

  if (await User.findOne({ username }))
    return res.send({ error: 400, message: "Sorry but someone already has that name." });

  await user.updateOne({ username });
  await Post.updateOne({ author: username })

  res.send({ newName: username });
});

router.route('/:usernameOrEmail/email').put(async(req, res) => {
  const findUser = await findNameOrEmail(req.params.usernameOrEmail);
  if (!findUser) return res.status(400).send("No user found!");

  const { email } = req.body;
  if (!email) return res.status(404).send("Please provide a email!");

  const checkEmail = await User.findOne({ email });
  if (checkEmail) return res.send("You cannot use this email!");

  await findUser.updateOne({ email });
  return res.send({ newEmail: email })
});

router.route('/').post(async(req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.send({ error: 400, message: "Sorry. But it seems you are missing a piece of information." });

  const user = new User({ username: username, password: password, email: email });
  await user.save();

  res.send(user);
})

router.route('/:usernameOrEmail').delete(async(req, res) => {
  const findUser = await findNameOrEmail(req.params.usernameOrEmail);
  if (!findUser) return res.status(400).send("No user found!");
  await Post.findOneAndDelete({ author: findUser.username })
  res.send(await findUser.deleteOne());
})

module.exports = router;
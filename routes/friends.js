const router = require("express").Router();
const User = require("../models/User");

router.route("/:username").get(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  res.send({ count: user.friends.length, friends: user.friends });
})

router.route("/:username").post(async (req, res) => {
  const { username } = req.body;
  if (!username) return res.send({ error: 400, message: "You need a friend username." });
  if (!req.params.username) return res.send({ error: 400, message: "You need a username." });
  const foundUser = await User.findOne({ username: req.params.username });
  if (!(await User.findOne({ username: username }))) return res.send({ error: 400, message: "Friend name does not exist."})
  if (!foundUser) return res.send({ error: 400, message: "User does not exist." });
  if (foundUser.friends.includes(username)) return res.send({ error: 400, message: "User is already a friend!"})
  foundUser.friends.push(username);
  
  res.send(await foundUser.save());
})

router.route("/:username").delete(async (req, res) => {
  const { username } = req.body;
  if (!username) return res.send({ error: 400, message: "You need a friend username." });
  if (!req.params.username) return res.send({ error: 400, message: "You need a username." });
  const foundUser = await User.findOne({ username: req.params.username });
  if (!foundUser) return res.send({ error: 400, message: "User does not exist." });
  if (!foundUser.friends.includes(username)) return res.send({ error: 400, message: `${username} is not ${req.params.username}'s friend.` });

  const index = foundUser.friends.indexOf(username);
  if (index > -1) {
    foundUser.friends.splice(index, 1);
  }
  res.send(await foundUser.save());
})

module.exports = router;
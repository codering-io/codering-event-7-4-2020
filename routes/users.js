const router = require("express").Router();
const User = require("../models/User");

// GET - Show all users without the password
router.get("/", async (req, res) => {
  const all = await User.find().select("-password");
  res.send(all);
});

// GET - Show a specific user without the password
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select("-password");
  if (!user) return res.status(404).send("No user found!");
  res.send(user);
});

// POST - Create a new user
router.post("/", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(404).send("Provide a username, email, and password!");
  }

  const test = new User({ username, email, password });
  await test.save();
  res.send(test);
});

// PUT - Update a users name by email or username
router.put("/:user/username", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.user);
  if (!findUser) return res.status(404).send("No user found!");

  const { username } = req.body;
  if (!username) return res.status(404).send("Please provide a username!");

  const checkName = await User.findOne({ email });
  if (checkName) return res.send("You cannot use this email!");

  await findUser.updateOne({ username });
  res.sendStatus(200);
});

// PUT - Update a users email by email or username
router.put("/:user/email", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.user);
  if (!findUser) return res.status(404).send("No user found!");

  const { email } = req.body;
  if (!email) return res.status(404).send("Please provide a email!");

  const checkEmail = await User.findOne({ email });
  if (checkEmail) return res.send("You cannot use this email!");

  await findUser.updateOne({ email });
  res.sendStatus(200);
});

// DELETE - Delete a user by email or username
router.delete("/:user", async (req, res) => {
  const findUser = await findNameOrEmail(req.params.user);
  if (!findUser) return res.status(404).send("No user found!");
  res.send(await findUser.deleteOne());
});

module.exports = router;

// Find a user by email or username
async function findNameOrEmail(value) {
  const findName = await User.findOne({ username: value });
  if (findName) return findName;
  const findEmail = await User.findOne({ email: value });
  if (findEmail) return findEmail;
  return null;
}

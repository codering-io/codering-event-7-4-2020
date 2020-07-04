const User = require("../models/User")

async function findNameOrEmail(value) {
  const findName = await User.findOne({ username: value });
  if (findName) return findName;
  const findEmail = await User.findOne({ email: value });
  if (findEmail) return findEmail;
  return null;
}

module.exports = findNameOrEmail
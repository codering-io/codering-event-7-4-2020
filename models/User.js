const mongoose = require("mongoose");

module.exports = mongoose.model("User", new Schema({
    username: String,
    password: String,
    email: String,
}));
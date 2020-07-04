const mongoose = require("mongoose");

module.exports = mongoose.model("Post", new mongoose.Schema({
    title: String,
    content: String,
    author: String, // (username)
    createdOn: Date,
    editedOn: Date
}));
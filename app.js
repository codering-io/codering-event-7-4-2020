const express = require('express');
const mongoose = require('mongoose');
const User = require("./models/User");

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://localhost:27017/coderingevent1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.get('/', (req, res) => {
    res.send(200);
});

app.get("/users/", async (req, res) => {
    let users = await User.find({});

    res.send({ count: users.length, users: users });
});

app.post('/users/', async (req, res) => {
    if (req.body.username && req.body.password && req.body.email) {
        var existing = await User.findOne({ email: req.body.email });
        if (existing) {
            return res.send(409);
        }
        var newUser = new users({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        await newUser.save();
        res.send(201);
    }
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));
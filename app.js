const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users")
const postsRouter = require("./routes/posts")
const friendsRouter = require("./routes/friends")

const app = express();
const PORT = 3001;

app.use(express.json())
app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/friends", friendsRouter)


mongoose.connect("mongodb+srv://localhost:27017/coderingevent1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.listen(PORT, () => {
  console.log(`Server is listening to requests on Port ${PORT}`);
});

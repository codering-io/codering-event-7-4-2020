const express = require('express');
const mongoose = require('mongoose');
t
const app = express();
const PORT = 3001;

mongoose.connect('mongodb://localhost:27017/coderingevent1', {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

app.get('/', (req, res) => {
  res.send(200);
});

app.listen(PORT, () => console.log(`Server is listening to requests on Port ${PORT}`));

const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  age: String
});

module.exports = Author = mongoose.model("author", authorSchema);

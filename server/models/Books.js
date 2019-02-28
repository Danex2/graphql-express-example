const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: String,
  genre: String,
  authorId: String
});

module.exports = Books = mongoose.model("book", bookSchema);

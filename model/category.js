const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: String,
  url: String
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;

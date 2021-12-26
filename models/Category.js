const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", CategorySchema);

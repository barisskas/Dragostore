const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    queryName: String,
  },
  { timestamps: true }
);

CategorySchema.pre(["save"], function () {
  this.queryName = slugify(this.name, { lower: true });
});

module.exports = mongoose.model("category", CategorySchema);

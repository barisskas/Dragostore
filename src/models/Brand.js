const mongoose = require("mongoose");
const slugify = require("slugify");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    queryName: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true }
);

BrandSchema.pre(["save"], function () {
  this.queryName = slugify(this.name, { lower: true });
});

module.exports = mongoose.model("brand", BrandSchema);

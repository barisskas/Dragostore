const mongoose = require("mongoose");
const slugify = require("slugify");

const Productschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    queryName: String,
    price: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        isBanner: Boolean,
      },
    ],
    brand: { type: mongoose.Types.ObjectId, ref: "brand", required: true },
    features: String,
  },
  { timestamps: true }
);

Productschema.pre("save", function () {
  this.queryName = slugify(this.name);
});

module.exports = mongoose.model("product", Productschema);

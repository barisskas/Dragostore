const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    baskets: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  },
  { timestamps: true }
);

UserSchema.pre("save", function () {
  //password hash
});

module.exports = mongoose.model("user", UserSchema);

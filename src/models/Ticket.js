const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", ticketSchema);

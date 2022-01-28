const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString);

mongoose.connection.on("open", () => {
  console.log("connected mongodb");
});

mongoose.connection.on("error", (error) => {});

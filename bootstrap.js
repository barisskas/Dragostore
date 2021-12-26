const mongoose = require("mongoose");

console.log(process.env.MONGODB_URI);

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString);

mongoose.connection.on("open", () => {
  console.log("mongodb: connected");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

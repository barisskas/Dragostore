const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString);

mongoose.connection.on("open", () => {
  console.log("mongodb: connected");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

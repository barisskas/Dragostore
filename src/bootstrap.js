const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString);

mongoose.connection.on("open", () => {});

mongoose.connection.on("error", (error) => {});

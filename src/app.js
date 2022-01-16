const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const productMiddleware = require("./middleware/product");

const app = express();
const expressLayouts = require("express-ejs-layouts");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

require("./strategies/local");
//session
app.use(
  session({
    secret: "secred",

    cookie: {
      maxAge: 6000000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.user);
  res.locals.user = req.user;
  next();
});

app.use("/", productMiddleware, indexRouter);
app.use("/api", apiRouter);

// mongodb connection
require("dotenv").config();
require("./bootstrap");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;

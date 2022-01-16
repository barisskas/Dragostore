const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        console.log({ email, password });
        const user = await User.findOne({ email });

        if (!user) return done(null, false, { message: "Incorrect email." });

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

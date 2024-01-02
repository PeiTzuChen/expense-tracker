const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local");
const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_URL,
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      const password = Math.random().toString(36).slice(-8);
      const email = profile.emails[0].value;
      const name = profile.displayName;

      bcrypt.hash(password, 10).then((hash) => {
        return User.findOrCreate({
          where: { email },
          raw: true,
          defaults: {
            password: hash,
            name,
            email,
          },
        })
          .then((user) => {
            done(null, user[0]);
          })
          .catch((error) => {
            error.errorMessage = "登入失敗";
            return done(error);
          });
      });
    }
  )
);


passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            type: "error",
            message: "信箱或密碼錯誤",
          });
        }
        bcrypt.compare(password, user.password).then((result) => {
          if (!result) {
            return done(null, false, {
              type: "error",
              message: "密碼錯誤",
            });
          }
          done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        return done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id });
});

passport.deserializeUser((id, done) => {
  done(null, id);
});


module.exports = passport

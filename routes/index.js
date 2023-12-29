const express = require("express");
const router = express.Router();
const expense = require("./expense");
const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20");
const passport = require("passport");
const authHandler = require("../middleware/authHandler");
const LocalStrategy = require("passport-local");
router.use("/expense", authHandler, expense);

//google 登入
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1046263501450-8jov0fsmsapfqm171mo68u4aaki7fphd.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/oauth2/google/callback",
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

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/users", (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const a = "a".charCodeAt(0);
  const A = "A".charCodeAt(0);
  let upperAlphabet = [];
  let lowerAlphabet = [];
  let number = Array.from("1234567890");
  for (let i = 0; i < 26; i++) {
    upperAlphabet.push(String.fromCharCode(A + i));
    lowerAlphabet.push(String.fromCharCode(a + i));
  }
  if (!upperAlphabet.some((element) => password.includes(element))) {
    req.flash("error", "密碼需含大寫");
    return res.redirect("back");
  }
  if (!lowerAlphabet.some((element) => password.includes(element))) {
    req.flash("error", "密碼需含小寫");
    return res.redirect("back");
  }
  if (!number.some((element) => password.includes(element))) {
    req.flash("error", "密碼需含數字");
    return res.redirect("back");
  }
  if (password.length < 8) {
    req.flash("error", "密碼不足8碼");
    return res.redirect("back");
  }

  if (password !== confirmPassword) {
    req.flash("error", "密碼與驗證密碼不符");
    return res.redirect("back");
  }
  if (!password || !email) {
    req.flash("error", "密碼及信箱為必填");
    return res.redirect("back");
  }
  User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        req.flash("error", "此信箱註冊過");
        return res.redirect("back");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, email, password: hash });
    })
    .then(() => {
      req.flash("success", "註冊成功");
      return res.redirect("/login");
    })
    .catch((error) => {
      error.errorMessage = "註冊失敗";
      return next(error);
    });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login/google", passport.authenticate("google"));

router.get(
  "/oauth2/google/callback",
  passport.authenticate("google", {
    successRedirect: "/expense",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/expense",
    failureRedirect: "/login",
    failureFlash:true,
  })
);

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
});

module.exports = router;

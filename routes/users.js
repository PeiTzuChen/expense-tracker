const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {
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

module.exports = router;

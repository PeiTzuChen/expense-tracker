const passport = require("passport");
const express = require("express");
const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/expense",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
});

module.exports = router;
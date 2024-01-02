const passport = require("passport");
const express = require("express");
const router = express.Router();

router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/expense",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
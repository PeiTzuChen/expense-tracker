const express = require("express");
const router = express.Router();
const expense =require("./expense")

router.use("/expense",expense)

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render('login')
});

router.get("/", (req, res) => {
  res.redirect("/expense");
});

module.exports=router
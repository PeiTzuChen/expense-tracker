const express = require("express");
const router = express.Router();
const expense =require("./expense")

router.use("/expense",expense)

router.get("/", (req, res) => {
  res.redirect("/expense");
});


module.exports=router
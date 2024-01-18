const express = require("express");
const router = express.Router();
const expense = require("./expense");
const oauth20 = require("./oauth20");
const root = require("./root");
const users = require("./users");
const authHandler = require("../middleware/authHandler");

router.use("/users",users);
router.use("/oauth2", oauth20);
router.use("/",root);
router.use("/expense", authHandler, expense);

module.exports = router;

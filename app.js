const express = require("express");
const app = express();
const port = 3000;
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const messageHandler = require("./middleware/messageHandler");
const errorHandler = require("./middleware/errorHandler");
const router = require("./routes");
const passport = require("passport");
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));
app.use(flash());
app.use(messageHandler);
app.use(router);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`express server listening on http://localhost:${port}`);
});

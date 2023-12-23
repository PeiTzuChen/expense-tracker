const express = require("express")
const app = express()
const port = 3000
const { engine } = require("express-handlebars");

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/",(req,res)=> {
  res.redirect("/total")
})

app.get("/expense", (req, res) => {
  res.render("expense");
});

app.get("/expense/new", (req, res) => {
  res.render("new");
});

app.get("/expense/id/edit", (req, res) => {
  res.render("edit");
});

app.listen(port,()=>{
console.log(`express server listening on http://localhost:${port}`);
})

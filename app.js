const express = require("express")
const app = express()
const port = 3000
const { engine } = require("express-handlebars");
const db = require("./models")
const Category = db.Category;
const Record = db.Record;

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

app.use(express.urlencoded({ extended: true }));

app.post("/expense", (req, res) => {
  const { name, date, category, amount } = req.body;

  Category.findOne({where: {name:category},raw:true})
  .then((category)=>{
    return Record.create({name,date,amount,userId,categoryId:category.id})
  }).then(()=>{
    res.redirect('/expense')
  })
});

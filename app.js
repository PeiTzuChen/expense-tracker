const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const db = require("./models");
const Category = db.Category;
const Record = db.Record;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/expense");
});

app.get("/expense", (req, res) => {
  Record.findAll({
    attributes: ["id", "name", "date", "amount", "categoryId"],
    raw: true,
    include: [
      {
        model: Category,
        attributes: ["name"],
      },
    ],
  }).then((record) => {
    res.render("expense",{record});
  });
  
});

app.post("/expense", (req, res) => {
  const { name, date, category, amount } = req.body;

  Category.findOne({ where: { name: category }, raw: true })
    .then((category) => {
      return Record.create({
        name,
        date,
        amount,
        categoryId: category.id,
      });
    })
    .then(() => {
      res.redirect("/expense");
    });
});

app.get("/expense/new", (req, res) => {
  res.render("new");
});

app.get("/expense/id/edit", (req, res) => {
  res.render("edit");
});

app.listen(port, () => {
  console.log(`express server listening on http://localhost:${port}`);
});

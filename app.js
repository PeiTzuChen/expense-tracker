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
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/expense");
});

const icon = require("./public/icon.json");
app.get("/expense", (req, res) => {
  let totalAmount = 0;
  Record.findAll({
    attributes: ["id", "name", "date", "amount"],
    raw: true,
    include: [
      {
        model: Category,
        attributes: ["name"],
      },
    ],
  }).then((records) => {
    records.forEach((record) => {
      record.icon = icon[record["Category.name"]];
      totalAmount += record.amount;
    });

    res.render("expense", { records, totalAmount });
  });
});

app.get("/expense/category", (req, res) => {
  let totalAmount = 0;
  const selectCategory = req.query.select;
  Category.findOne({
    where: { name: selectCategory },
    raw: true,
  }).then((category) => {
    return Record.findAll({
      attributes: ["id", "name", "date", "amount"],
      raw: true,
      where: { categoryId: category.id },
    }).then((records) => {
      records.forEach((record) => {
        totalAmount += record.amount;
        record.icon = icon[selectCategory];
      });
      res.render("expense", { records, totalAmount });
    });
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

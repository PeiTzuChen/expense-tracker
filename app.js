const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const db = require("./models");
const Category = db.Category;
const Record = db.Record;
const icon = require("./public/icon.json");
const methodOverride = require("method-override");

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.redirect("/expense");
});

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
    records.forEach((record, index) => {
      record.icon = icon[record["Category.name"]];
      totalAmount += record.amount;
      record.index = index;
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

app.get("/expense/new", (req, res) => {
  res.render("new");
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

app.get("/expense/:id/edit", (req, res) => {
  const id = req.params.id;
  Record.findByPk(id, {
    raw: true,
    attributes: ["id", "name", "date", "amount"],
    include: Category,
  }).then((record) => {
    record.category = record["Category.name"];
    res.render("edit", { record });
  });
});

app.put("/expense/:id", (req, res) => {
  const id = req.params.id;
  const { name, date, category } = req.body;
  const amount = parseInt(req.body.amount);
  Category.findOne({ where: { name: category } })
    .then((category) => {
      return Record.update(
        { name, date, amount, categoryId: category.id },
        { where: { id } }
      );
    })
    .then(() => {
      res.redirect("/expense");
    });
});

app.delete("/expense/:id", (req, res) => {
  const id = req.params.id;
  Record.destroy({ where: { id } }).then(() => {
    res.redirect("/expense");
  });
});

app.listen(port, () => {
  console.log(`express server listening on http://localhost:${port}`);
});

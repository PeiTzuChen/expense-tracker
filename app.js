const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const db = require("./models");
const Category = db.Category;
const Record = db.Record;
const icon = require("./public/icon.json");
const methodOverride = require("method-override");
const pageSize = 5;
const flash = require("connect-flash")
const session = require("express-session")
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: 'keyword',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash())

app.get("/", (req, res) => {
  res.redirect("/expense");
});

app.get("/expense", (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1;
  let totalAmount = 0;

  Record.sum("amount", {})
    .then((sum) => {
      totalAmount = sum;
      return Record.findAndCountAll({
        attributes: ["id", "name", "date", "amount"],
        raw: true,
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      });
    })
    .then((data) => {
      const totalPage = Math.ceil(data.count / pageSize);
      const records = data.rows;
      records.forEach((record, index) => {
        record.icon = icon[record["Category.name"]];
        record.index = index;
      });
      return res.render("expense", {
        records,
        totalAmount,
        pageNumber,
        prev: pageNumber > 1 ? pageNumber - 1 : pageNumber,
        next: pageNumber < totalPage ? pageNumber + 1 : pageNumber,
        totalPage,
        message:req.flash('success'),
        error_msg:req.flash('error')
      });
    }).catch((error)=>{
      console.error(error)
      req.flash("error","資料處理失敗")
      return res.redirect('back')
    })
});

app.get("/expense/category", (req, res) => {
  let totalAmount = 0;
  const pageNumber = parseInt(req.query.page) || 1;
  const selectCategory = req.query.select;
  let categoryId = 0;

  Category.findOne({
    where: { name: selectCategory },
    raw: true,
  })
    .then((category) => {
      categoryId = category.id;
      return Record.sum("amount", { where: { categoryId } });
    })
    .then((sum) => {
      totalAmount = sum;
      return Record.findAndCountAll({
        attributes: ["id", "name", "date", "amount"],
        raw: true,
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
        where: { categoryId },
      });
    })
    .then((data) => {
      const totalPage = Math.ceil(data.count / pageSize);
      const records = data.rows;
      records.forEach((record, index) => {
        record.icon = icon[selectCategory];
        record.index = index;
      });
      res.render("expense", {
        records,
        totalAmount,
        pageNumber,
        prev: pageNumber > 1 ? pageNumber - 1 : pageNumber,
        next: pageNumber < totalPage ? pageNumber + 1 : pageNumber,
        totalPage,
        selectCategory,
      });
    })
    .catch((error) => {
      console.error(error);
      req.flash("error", "資料處理失敗");
      return res.redirect("back");
    });
});

app.get("/expense/new", (req, res) => {
  res.render("new",{error_msg:req.flash("error")});
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
      req.flash("success", "新增成功");
      res.redirect("/expense");
    })
    .catch((error) => {
      console.error(error);
      req.flash("error", "資料新增失敗");
      return res.redirect("back");
    });
});

app.get("/expense/:id/edit", (req, res) => {
  const id = req.params.id;
  Record.findByPk(id, {
    raw: true,
    attributes: ["id", "name", "date", "amount"],
    include: Category,
  })
    .then((record) => {
      record.category = record["Category.name"];
      res.render("edit", { record, error_msg: req.flash("error") });
    })
    .catch((error) => {
      console.error(error);
      req.flash("error", "資料處理失敗");
      return res.redirect("back");
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
      req.flash("success", "修改成功");
      res.redirect("/expense");
    }).catch((error)=>{
      console.error(error);
      req.flash("error", "更新失敗");
      return res.redirect("back");
    })
});

app.delete("/expense/:id", (req, res) => {
  const id = req.params.id;
  Record.destroy({ where: { id } }).then(() => {
    req.flash("success","刪除成功")
    res.redirect("/expense");
  }).catch((error)=>{
      console.error(error);
      req.flash("error", "刪除失敗");
      return res.redirect("back");
    })
});

app.listen(port, () => {
  console.log(`express server listening on http://localhost:${port}`);
});

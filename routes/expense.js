const express = require("express");
const router = express.Router();
const db = require("../models");
const Category = db.Category;
const Record = db.Record;
const icon = require("../public/icon.json");
const pageSize = 5;

router.get("/", (req, res, next) => {
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
      });
    })
    .catch((error) => {
      error.errorMessage = "資料處理失敗";
      return next(error);
    });
});

router.get("/category", (req, res, next) => {
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
      return res.render("expense", {
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
      error.errorMessage = "資料處理失敗";
      return next(error);
    });
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", (req, res, next) => {
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
      return res.redirect("/expense");
    })
    .catch((error) => {
      error.errorMessage = "資料新增失敗";
      return next(error);
    });
});

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  Record.findByPk(id, {
    raw: true,
    attributes: ["id", "name", "date", "amount"],
    include: Category,
  })
    .then((record) => {
      record.category = record["Category.name"];
      return res.render("edit", { record });
    })
    .catch((error) => {
      error.errorMessage = "資料處理失敗";
      return next(error);
    });
});

router.put("/:id", (req, res, next) => {
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
      return res.redirect("/expense");
    })
    .catch((error) => {
      error.errorMessage = "更新失敗";
      return next(error);
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Record.destroy({ where: { id } })
    .then(() => {
      req.flash("success", "刪除成功");
      return res.redirect("/expense");
    })
    .catch((error) => {
      error.errorMessage = "刪除失敗";
      return next(error);
    });
});

module.exports=router
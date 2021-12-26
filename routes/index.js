const { response } = require("express");
const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

const Category = require("../models/Category");

const categories = [
  {
    name: "İşlemciler",
    queryString: "islemciler",
    products: [
      {
        name: "İ5",
        queryString: "i5",
      },
    ],
  },
  {
    name: "Ekran Kartları",
    queryString: "ekran-kartlari",
    products: [
      {
        name: "İ5",
        queryString: "i5",
      },
    ],
  },
];

/* GET home page. */
router.get("/", function (req, res) {
  res.locals.categories = categories;
  res.render("pages/home");
});

router.post("/category", async function (req, res) {
  if (!req.body.categoryName)
    res.status(300).json({ message: "Kategori adı boş olamaz" });

  const newCategory = new Category({
    name: req.body.categoryName,
  });

  await newCategory.save();

  res.status(200).json({ data: newCategory, message: "Başarıyla kaydettim" });
});

router.get("/category/:name", function (req, res) {
  res.locals.categories = categories;
  const categoryName = req.params.name;

  // Category.

  const foundedCategory = categories.find(
    (category) => category.queryString === categoryName
  );

  if (!foundedCategory) res.status(404).json({ message: "Not found" });

  res.render("pages/category", { category: foundedCategory });
});

// router.post("/category", function(req){

//   database.collection.add(req.data)
// })

module.exports = router;

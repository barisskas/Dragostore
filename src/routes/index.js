const express = require("express");
const router = express.Router();

const { fnCategory, fnBrand } = require("../controllers");

/* GET home page. */
router.get("/", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  res.render("pages/home");
});

router.get("/admin", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  res.render("pages/admin", {
    brands: await fnBrand.get(),
  });
});

router.get("/category/:name", function (req, res) {
  res.locals.categories = fnCategory.get();
  res.render("pages/category");
  const categoryName = req.params.name;

  // Category.

  const foundedCategory = categories.find(
    (category) => category.queryString === categoryName
  );

  if (!foundedCategory) res.status(404).json({ message: "Not found" });

  res.render("pages/category", { category: foundedCategory });
});

module.exports = router;

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

router.get("/category/:name", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  const categoryName = req.params.name;

  const { products } = await fnCategory.getFromCategoryQueryName(categoryName);

  // if (!foundedCategory) res.status(404).json({ message: "Not found" });

  res.render("pages/category", { products });
});

module.exports = router;

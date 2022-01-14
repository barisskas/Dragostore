const express = require("express");
const router = express.Router();

const { fnCategory, fnBrand, fnProduct } = require("../controllers");

/* GET home page. */
router.get("/", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  const lastProducts = await fnProduct.getWhereLimit(15);
  console.log(lastProducts);
  res.render("pages/home", { lastProducts });
});

router.get("/admin", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  res.render("pages/admin", {
    brands: await fnBrand.get(),
  });
});
router.get("/register", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  res.render("pages/register", {
    brands: await fnBrand.get(),
  });
});
router.get("/login", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  res.render("pages/login", {
    brands: await fnBrand.get(),
  });
});
router.get("/product/:queryName", async (req, res) => {
  console.log(req.params);
  const { queryName } = req.params;
  const product = await fnProduct.getFromQueryName(queryName);
  const brand = await fnBrand.getWhereById(product.brand);
  const category = await fnCategory.getWhereById(brand.category);

  console.log({ brand, category });

  res.locals.categories = await fnCategory.get();
  res.render("pages/product", {
    product: await fnProduct.getFromQueryName(queryName),
    categoryName: category.queryName,
  });
});

router.get("/category/:name", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  const categoryName = req.params.name;
  res.locals.productScript = true;

  const { products, brands } = await fnCategory.getFromCategoryQueryName(
    categoryName
  );

  // if (!foundedCategory) res.status(404).json({ message: "Not found" });

  res.render("pages/category", { products, brands, categoryName });
});

module.exports = router;

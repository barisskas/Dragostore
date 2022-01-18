const express = require("express");
const router = express.Router();

const { fnCategory, fnBrand, fnProduct } = require("../controllers");
const Brand = require("../models/Brand");

/* GET home page. */
router.get("/", async (req, res) => {
  res.locals.categories = await fnCategory.get();
  const lastProducts = await fnProduct.getWhereLimit(15);

  res.render("pages/home", { lastProducts });
});

router.get("/admin", async (req, res) => {
  const user = req.user;
  console.log(user);

  if (!user || !user.isAdmin) res.redirect("/");

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
router.get("/basket", async (req, res) => {
  const user = req.user;

  if (!user) return res.redirect("/");

  res.locals.categories = await fnCategory.get();
  const u = await fnProduct.myProducts(req.user);
  res.render("pages/basket", {
    items: u.baskets,
  });
});
router.get("/product/:queryName", async (req, res) => {
  try {
    const { queryName } = req.params;
    const product = await fnProduct.getFromQueryName(queryName);
    const brand = await fnBrand.getWhereById(product.brand);
    const category = await fnCategory.getWhereById(brand.category);

    res.locals.categories = await fnCategory.get();
    res.render("pages/product", {
      product: await fnProduct.getFromQueryName(queryName),
      categoryName: category.queryName,
    });
  } catch (error) {}
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

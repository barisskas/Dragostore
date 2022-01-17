const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const passport = require("passport");

const { fnCategory, fnBrand, fnProduct } = require("../../controllers");

// #region Category API
router
  .route("/category")
  .get(async (req, res) => {
    try {
      const categories = await fnCategory.get();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { name } = req.body;
      res.status(201).json(await fnCategory.add(name));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router
  .route("/category/:id")
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      if (id !== "*") {
        const deletedCategories = await fnCategory.deleteById(id);
        res.json(deletedCategories);
      } else res.json(await fnCategory.delete());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      res.json(await fnCategory.update(id, name));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// #endregion

// #region Brand API
router
  .route("/brand")
  .get(async (req, res) => {
    try {
      const brands = await fnBrand.get();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, category } = req.body;
      res.status(201).json(await fnBrand.add({ name, category }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router
  .route("/brand/:id")
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      if (id !== "*") {
        const deletedBrands = await fnBrand.deleteById(id);
        res.json(deletedBrands);
      } else res.json(await fnBrand.delete());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category } = req.body;
      res.json(await fnBrand.update(id, { name, category }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get("/brand-from-category/:queryName", async (req, res) => {
  try {
    const { queryName } = req.params;

    res.json(await fnBrand.getFromCategoryQueryName(queryName));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// #endregion

// #region Product API
router
  .route("/product")
  .get(async (req, res) => {
    try {
      const products = await fnProduct.get(req.query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, price, brand, features, images } = req.body;
      res
        .status(201)
        .json(await fnProduct.add({ name, price, brand, images, features }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router
  .route("/product/:id")
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      if (id !== "*") {
        const deletedProducts = await fnProduct.deleteById(id);
        res.json(deletedProducts);
      } else res.json(await fnProduct.delete());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, brand, images } = req.body;
      res.json(await fnProduct.update(id, { name, price, brand, images }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
router.delete("/product-name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    res.json(await fnProduct.deleteByName(name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// #endregion

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (info) res.status(403).json({ message: info.message });

    req.logIn(user, function (err) {
      if (err) return next(err);

      return res.status(200).json({ status: "ok" });
    });
  })(req, res, next);
});
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password)
    return res.status(403).json({ message: "lütfen tüm alanları doldurunuz." });

  if (password.length < 6)
    return res
      .status(403)
      .json({ message: "password alanı 6 karakterden büyük olmalı" });

  const user = await User.findOne({ email });
  if (user)
    return res.status(403).json({ message: "büle bi kullanici kayitli" });

  const newUser = new User({
    fullName,
    email,
  });

  const hashPassword = await bcrypt.hash(password, 10);
  newUser.password = hashPassword;

  res.json(await newUser.save());
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/getBrandId", async (req, res) => {
  const { brandQueryName, categoryQueryName } = req.query;
  const categoryId = (await Category.findOne({ queryName: categoryQueryName }))
    .id;

  res.json({
    brandId: await Brand.findOne({
      queryName: brandQueryName,
      category: categoryId,
    }),
  });
});

router.get("/add-basket", async (req, res) => {
  const user = req.user;

  const { productId } = req.query;

  if (!user) res.redirect("/");

  user.baskets.push(productId);

  res.json(await user.save());
});

router.get("/remove-basket", async (req, res) => {
  const user = req.user;

  const { productId } = req.query;

  if (!user) res.redirect("/");

  res.json(await user.update({ $pull: { baskets: productId } }));
});

router.get("/baskets", async (req, res) => {
  const user = req.user;

  if (!user) res.redirect("/");

  return await fnProduct.myProducts();
});

module.exports = router;

const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

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
    console.log(queryName);
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
      console.log(req.query);
      const products = await fnProduct.get(req.query);
      res.json(products);
    } catch (error) {
      console.log(error);
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
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];
  if (!name || !email || !password)
    return res.status(403).json({ message: "lütfen tüm alanları doldurunuz." });

  if (password.length < 6)
    return res
      .status(403)
      .json({ message: "password alanı 6 karakterden büyük olmalı" });

  const user = await User.findOne({ email });
  if (user)
    return res.status(403).json({ message: "büle bi kullanici kayitli" });

  const newUser = new User({
    name,
    email,
  });

  const hashPassword = await bcrypt.hash(password, 10);
  newUser.password = hashPassword;

  res.json(await newUser.save());
});

router.get("/getBrandId", async (req, res) => {
  const { brandQueryName, categoryQueryName } = req.query;
  const categoryId = (await Category.findOne({ queryName: categoryQueryName }))
    .id;

  console.log(categoryId);

  res.json({
    brandId: await Brand.findOne({
      queryName: brandQueryName,
      category: categoryId,
    }),
  });
});

module.exports = router;

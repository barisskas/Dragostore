const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const User = require("../models/User");

const fnCategory = {
  async get() {
    return await Category.find();
  },
  async add(name) {
    const newCategory = new Category({ name });
    return await newCategory.save();
  },
  async update(id, name) {
    return await Category.findByIdAndUpdate(
      id,
      { name },
      {
        new: true,
      }
    );
  },
  async deleteById(id) {
    const brands = await Brand.find({ category: id });
    for (let i = 0; i < brands.length; i++) {
      const brand = brands[i];
      brand.remove();
    }
    return await Category.findByIdAndDelete(id);
  },
  async delete() {
    return await Category.remove();
  },

  async getFromCategoryQueryName(name) {
    const category = await Category.findOne({ queryName: name });
    const brands = await Brand.find({ category: category.id }).lean();
    let allProducts = [];

    for (let i = 0; i < brands.length; i++) {
      let brand = brands[i];
      const products = await Product.find({ brand: brand._id });
      allProducts.push(...products);
    }

    return {
      brands,
      products: allProducts,
    };
  },
  async getWhereById(id) {
    return await Category.findById(id);
  },
};

const fnBrand = {
  async get() {
    return await Brand.find().populate("category");
  },
  async add({ name, category }) {
    const newBrand = new Brand({ name, category });
    return await newBrand.save();
  },
  async update(id, { name, category }) {
    return await Brand.findByIdAndUpdate(
      id,
      { name, category },
      {
        new: true,
      }
    );
  },
  async deleteById(id) {
    return await Brand.findByIdAndDelete(id);
  },
  async delete() {
    return await Brand.remove();
  },
  async getFromCategoryQueryName(name) {
    const id = (await Category.findOne({ queryName: name })).id;
    return await Brand.find({
      category: id,
    });
  },
  async getWhereById(id) {
    return await Brand.findById(id);
  },
};

const fnProduct = {
  async get({ brandIds, minPrice, maxPrice, category }) {
    brandIds = brandIds ? JSON.parse(brandIds) : [];

    let { products } = await fnCategory.getFromCategoryQueryName(category);

    products = products.filter((product) => {
      return (
        product.price > (Number(minPrice) || 0) &&
        product.price < (Number(maxPrice) || 999999)
      );
    });

    if (brandIds && brandIds.length)
      products = products.filter((product) => {
        return brandIds.includes(String(product.brand));
      });

    return products;
  },
  async getFromQueryName(queryName) {
    return await Product.findOne({ queryName });
  },
  async add({ name, price, brand, images, features }) {
    const newProduct = new Product({ name, price, brand, images, features });
    return await newProduct.save();
  },
  async update(id, { name, price, brand, images }) {
    return await Product.findByIdAndUpdate(
      id,
      { name, price, brand, images },
      {
        new: true,
      }
    );
  },
  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  },
  async delete() {
    return await Product.remove();
  },
  async deleteByName(name) {
    return await Product.findOneAndDelete({ name });
  },
  async getWhereLimit(limit) {
    return await Product.find()
      .populate({
        path: "brand",
        populate: {
          path: "category",
        },
      })
      .sort({ createdAt: 1 })
      .limit(limit);
  },

  async myProducts(user) {
    return await User.findById(user.id).populate("baskets");

    // User.aggregate([
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "baskets",
    //       foreignField: "_id",
    //       as: "items",
    //     },
    //   },
    //   {
    //     $unwind: { path: "$items", preserveNullAndEmptyArrays: true },
    //   },
    //   {
    //     $match: {
    //       _id: user._id,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$items",

    //       // name: { $first: "$items.name" },
    //       // queryName: { $first: "$items.queryName" },
    //       // images: { $first: "$items.images" },

    //       // name: "$items.name",
    //       // images: "$items.images",
    //       price: {
    //         $sum: 1,
    //       },
    //       // totalAmount: { $sum: { $multiply: ["$price", "$count"] } },
    //     },
    //   },
    //   // {
    //   //   $project: {
    //   //     items: 1,
    //   //   },
    //   // },
    // ]);
  },
};

module.exports = { fnCategory, fnBrand, fnProduct };

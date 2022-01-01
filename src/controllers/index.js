const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Product = require("../models/Product");

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
};

const fnProduct = {
  async get() {
    return await Product.find().populate("brand");
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
};

module.exports = { fnCategory, fnBrand, fnProduct };

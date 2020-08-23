const Category = require('../models/Category');

const mapCategory = (category) => ({
  id: category._id,
  title: category.title,
  subcategories: category.subcategories.map((subCategory) => ({
    id: subCategory._id,
    title: subCategory.title,
  })),
});

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({}).populate('subcategories');
  ctx.body = {categories: categories.map(mapCategory)};
};

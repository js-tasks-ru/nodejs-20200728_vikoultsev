const _ = require('lodash');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const validateObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);

const pickProductData = (productFromDB) => _.pick(productFromDB, [
  'title',
  'id',
  'category',
  'subcategory',
  'price',
  'description',
  'images',
]);

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  const params = subcategory ? {subcategory} : {};
  const products = await Product.find(params);

  ctx.body = {products: products.map((product) => {
    return pickProductData(product);
  })};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
  if (ctx.params.id && validateObjectId(ctx.params.id)) {
    const product = await Product.findById(ctx.params.id);
    if (product) {
      ctx.body = {product: pickProductData(product)};
    } else {
      ctx.status = 404;
    }
  } else {
    ctx.status = 400;
  }
};


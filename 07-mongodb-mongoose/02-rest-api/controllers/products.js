const product = require('../models/Product');
const mongoose = require('mongoose');

const productTemplateBuilder = (product) => {
  return {
    id: product.id,
    title: product.title,
    images: product.images,
    category: product.category.id,
    subcategory: product.subcategory.id,
    price: product.price,
    description: product. description,
  }
}

const isObjecId = (str) => {
  return /^[abcdef\d]+$/i.test(str)
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if ('subcategory' in ctx.request.query){
    let products = await product.find({subcategory: mongoose.Types.ObjectId(ctx.request.query.subcategory)});

    ctx.body = {products: products.map(productTemplateBuilder)}
  } else {
    await next();
    ctx.body = {products: ctx.state.productsList};
  }
};

module.exports.productList = async function productList(ctx, next) {
  let products = await product.find();
  ctx.state.productsList = products.map(productTemplateBuilder)
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if(isObjecId(id)){
    let oneProduct = await product.findById(id);

    if (oneProduct) {
      ctx.body = {product: productTemplateBuilder(oneProduct)};
    } else {
      ctx.throw(404, "Product hasn't found"); 
    }
  } else {
    ctx.throw(400, 'Invalid ID');
  }
};

module.exports.productTemplateBuilder = productTemplateBuilder;

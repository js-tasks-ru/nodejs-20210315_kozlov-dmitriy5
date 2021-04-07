const product = require('../models/Product');
const {productTemplateBuilder} = require('../../02-rest-api/controllers/products')


module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if ('query' in ctx.request.query){
    let products = await product.find({$text: {$search : ctx.request.query.query}});

    ctx.body = {products: products.map(productTemplateBuilder)};
  } else {
    ctx.throw(400, 'Bad Request')
  }
};

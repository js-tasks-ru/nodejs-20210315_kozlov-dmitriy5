const Category = require('../models/Category');
const mongoose = require('mongoose');


module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find()

  ctx.body = {categories: categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
      subcategories: category.subcategories.map((item) => {
        return {id: item.id, title: item.title}
      })
    }
  })}; 
};

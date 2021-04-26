const { v4: uuid } = require('uuid');
const passport = require('../libs/passport');
// const userModel = require('../models/User');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    console.log(user)
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }
    
    const token = uuid();

    ctx.body = {token};
  })(ctx, next);
};

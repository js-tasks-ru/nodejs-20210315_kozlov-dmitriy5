const { ValidationError } = require('webpack');
const userModel = require('../../models/User');


// Закоментил данную строку, мешала выолнять конструкцию try-catch, да и вообще не понятно зачем она тут нужна
// const { catch } = require('../connection');

const is_email_valid = (email) => {
  return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email);
}

const suitStrategies = [
  'github',
  'facebook',
  'vkontakte',
]


module.exports = async function authenticate(strategy, email, displayName, done) {
  if (suitStrategies.indexOf(strategy) != -1){
    if (!email){
      done(null, false, 'Не указан email');
    } else {
      let user = await userModel.findOne({email: email});
      if (!user){
        try{
          user = await userModel({email: email, displayName: displayName}).save();
        } catch (err){
          done(err);
        }
      } 
      done(null, user);
    }
  } else {
    done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
  }
};

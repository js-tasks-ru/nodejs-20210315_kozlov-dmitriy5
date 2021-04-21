const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../../models/User');


module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await userModel.findOne({email: email}).exec();
      if (!user){
        done(null, false, "Нет такого пользователя");  
      } else {
        if (await user.checkPassword(password)){
          done(null, user);
        } else {
          done(null, false, 'Неверный пароль');  
        }
      }
      // console.log('The end');
      // done(null, false, 'Стратегия подключена, но еще не настроена');  
    },
);

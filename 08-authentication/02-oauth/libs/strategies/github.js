const GithubStrategy = require('passport-github').Strategy;
const config = require('../../config');
const get = require('lodash/get');
const authenticate = require('./authenticate');

module.exports = new GithubStrategy({
  clientID: config.providers.github.app_id,
  clientSecret: config.providers.github.app_secret,
  callbackURL: config.providers.github.callback_uri,
  scope: ['user:email'],
  session: false,
}, function(accessToken, refreshToken, profile, done) {
// Так и не смог найти параметр, в котором github передаёт мне email... Локально протестировать не получилось
  authenticate('github', get(profile, 'emails[0].value'), profile.username, done);
});

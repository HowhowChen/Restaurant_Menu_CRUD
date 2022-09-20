const passport = require('passport')
const User = require('../models/user')
const localStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcryptjs')

module.exports = app => {
  //  初始化Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  //  設定本地策略
  passport.use(new localStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registed!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(error => done(error, false))
  }))

  //  設定facebook OAuth策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, 
    thirdPartyOAuthCallback
  ))

  //  設定google OAuth策略
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  },
    thirdPartyOAuthCallback 
  ))

  //  設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}

function thirdPartyOAuthCallback(accessToken, refreshToken, profile, done) {
  const { name, email } = profile._json
  User.findOne({ email })
    .then(user  => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(randomPassword, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(user => done(null, user))
        .catch(err => done(err, false))
    })
}

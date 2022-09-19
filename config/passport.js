const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

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
        if (user.password !== password) {
          return done(null, false, { message: 'Email Or Password incorrect.' })
        }
        return done(null, user)
      })
      .catch(error => done(error, false))
  }))

  //  設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })
}
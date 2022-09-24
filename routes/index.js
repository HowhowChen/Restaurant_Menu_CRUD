const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')

router.use('/restaurants', authenticator, restaurants)  // 加入驗證程序
router.use('/users', users)
router.use('/auth', auth) // Oauth
router.use('/', authenticator, home)  // 加入驗證程序

// get 404 error page 
router.get('*', (req, res) => {
  res.locals.layout = 'space.hbs'
  res.status(404).render('error404', { error: `We can't find this page.` })
})

module.exports = router

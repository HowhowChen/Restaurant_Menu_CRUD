const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}
const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json')
const db = require('../../config/mongoose')
const User = require('../user')
const SEED_USER = {
  name: 'root',
  email: 'root@example',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(async user => {
      const userId = user._id
      const restaurantArr = restaurantList.results
      await Promise.all(restaurantArr.map(restaurant => {
        restaurant.userId = userId
        return Restaurant.create(restaurant)
      }))
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})

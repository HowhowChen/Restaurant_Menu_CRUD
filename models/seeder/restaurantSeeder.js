const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

const restaurantList = require('./restaurantList.json').results
const userList = require('./userList.json').users
const db = require('../../config/mongoose')
const Restaurant = require('../Restaurant')
const User = require('../user')

db.once('open', () => {
  Promise.all(userList.map(async user => {
    const { email, password, restaurantIndex } = user
    await bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        email,
        password: hash
      }))
      .then(user => {
        const restaurants = restaurantIndex.map(index => {
          const restaurants = restaurantList[index]
          restaurants.userId = user._id
          return restaurants
        })
        return Restaurant.create(restaurants)
      })
  }))
  .then(() => {
    console.log('finish seeds and close db connect')
    db.close()
  })
  .catch(error => console.log(error))
  .finally(() => {
    console.log('shut down process')
    process.exit()
  })
})

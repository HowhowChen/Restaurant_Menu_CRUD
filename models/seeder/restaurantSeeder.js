const mongoose = require('mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => console.log('MongoDB Error'))

db.once('open', () => {
  console.log('MongoDB Connect!')
  Restaurant.create(restaurantList.results)
    .then(() => {
      console.log('seeds saved')
      db.close()  //結束database連線
    })
    .catch(error => console.log(error))
})

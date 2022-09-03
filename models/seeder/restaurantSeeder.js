const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json')

const db = require('../../config/mongoose')

db.once('open', () => {
  Restaurant.create(restaurantList.results)
    .then(() => {
      console.log('seeds saved')
      db.close()//  結束database連線
    })
    .catch(error => console.log(error))
})

const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/Restaurant')
const app = express()
const port = 3000

//setting handlebars 
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//setting body parser
app.use(express.urlencoded({ extended: true }))

//setting static files
app.use(express.static('public'))

//setting mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => console.log('MongoDB Error'))

db.once('open', () => console.log('MongoDB Connect'))



//index
app.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then(menus => {
      res.render('index', { menus })
    })
    .catch(error => console.log(error))
})

//setting listen
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})
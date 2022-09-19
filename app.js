const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

//  setting handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

//  setting body parser
app.use(express.urlencoded({ extended: true }))

//  setting static files
app.use(express.static('public'))

//  use methodOverride
app.use(methodOverride('_method'))

//  將request 導入路由器
app.use(routes)

//  setting listen
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})

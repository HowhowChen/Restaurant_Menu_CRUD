const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

//  setting handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

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

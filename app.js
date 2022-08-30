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

//create page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//setting create function
app.post('/restaurants/new', (req, res) => {
  const menu = req.body
  return Restaurant.create(menu)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//setting read detail function
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(menu => {
      res.render('show', { menu })
    })
    .catch(error => console.log(error))
})

//setting search function 
app.get('/search', (req, res) => {
  const condition = req.query.condition
  const keyword = req.query.keyword
  let feedback = ''

  //name
  if (condition === 'name') {
    return Restaurant.find({'name': {'$regex': keyword, '$options': '$i'}})
      .lean()
      .then(menus => {
        if (menus.length !== 0) {
          feedback = `發現:${menus.length}筆`
          return res.render('index', {menus, keyword, name: condition, feedback})
        } else {
          feedback = '未發現!!!'
          return res.render('index', {menus, keyword, name: condition, feedback})
        }
      })
      .catch(error => console.log(error))
  } 

  //category
  if (condition === 'category') {
     return Restaurant.find({'category': {'$regex': keyword, '$options': '$i'}})
    .lean()
    .then(menus => {
      if (menus.length !== 0) {
        feedback = `發現:${menus.length}筆`
        return res.render('index', {menus, keyword, category: condition, feedback})
      } else {
        feedback = '未發現!!!'
        return res.render('index', {menus, keyword, category: condition, feedback})
      }
    })
    .catch(error => console.log(error))
  }

  feedback = '請選擇條件!!!'
  res.render('index', {keyword, feedback })
})


//setting delete page
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(menu => res.render('edit', { menu }))
    .catch(error => console.log(error))
})


//setting delete function
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(menu => menu.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



//setting listen
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})
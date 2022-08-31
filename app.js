const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/Restaurant')
const app = express()
const port = 3000
const PER_PAGE_MENU = 12


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
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getPaginatorPages(menus)
      menus = getRenderByPage(menus)
      switch (totalPage) {
        case 1: 
          res.render('index', { menus, pages, first: 1, page: 1, totalPage })
          break
        default:   //totalPage > 1, the nextPage will show
          res.render('index', { menus, pages, first: 1, nextPage: 2, page: 1, totalPage })
          break
      } 
    })
    .catch(error => console.log(error))
})


//setting index paginator function
app.get('/index/:page', (req, res) => {
  let page = Number(req.params.page)    
  return Restaurant.find()
    .lean()
    .then(menus => {
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getPaginatorPages(menus, page) 
      menus = getRenderByPage(menus, page)
      let previousPage, nextPage  
      switch (page) {
        case 1:           //首頁
          if (totalPage > 1) {   //totalPage > 1, the nextPage will show
            nextPage = page + 1
            res.render('index', {menus, pages, first: 1, nextPage, page, totalPage})
          } else {
            res.render('index', { menus, pages, first: 1, page: 1, totalPage })
          }
          break
        case totalPage:   //最後一頁
          previousPage = page - 1
          res.render('index', {menus, pages, end: 1, previousPage,  page, totalPage})
          break
        default:         //中間的部分
          nextPage = page + 1
          previousPage = page - 1
          res.render('index', {menus, pages, middle: 1, previousPage, nextPage,  page, totalPage})
          break
      }      
    })
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
  const page = req.query.page
  let feedback = ''
  
  if (page !== undefined) {
    return getRenderBySearchPaginator(res, condition, keyword, page, feedback)
  }

  //name
  if (condition === 'name') {
     //keyword equal empty
    if (keyword.trim().length === 0) {
      feedback = '請輸入關鍵字!'
      return res.render('search', {keyword, feedback, name: condition})
    }

    return Restaurant.find({'name': {'$regex': keyword, '$options': '$i'}})
      .lean()
      .then(menus => {
        if (menus.length !== 0) {
          const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
          const pages = getSearchPaginatorPages(menus, 1, condition, keyword)
          feedback = `發現:${menus.length}筆`
          menus = getRenderByPage(menus)
          
          switch (totalPage) {
            case 1:
              res.render('search', {menus, pages, first: 1, page: 1, totalPage, keyword, name: condition, feedback})
              break
            default:
              res.render('search', {menus, pages, first: 1, nextPage: 2, page: 1, totalPage, keyword, name: condition, feedback})
              break
          }
          //return res.render('search', {menus, keyword, name: condition, feedback})
        } else {
          feedback = '未發現!!!'
          return res.render('search', {keyword, name: condition, feedback})
        }
      })
      .catch(error => console.log(error))
  } 

  //category
  if (condition === 'category') {
    //keyword equal empty
    if (keyword.trim().length === 0) {
      feedback = '請輸入關鍵字!'
      return res.render('search', {keyword, feedback, category: condition})
    }

    return Restaurant.find({'category': {'$regex': keyword, '$options': '$i'}})
      .lean()
      .then(menus => {
        if (menus.length !== 0) {
          const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
          const pages = getSearchPaginatorPages(menus, 1, condition, keyword)
          feedback = `發現:${menus.length}筆`
          menus = getRenderByPage(menus)
          
          switch (totalPage) {
            case 1:
              res.render('search', {menus, pages, first: 1, page: 1, totalPage, keyword, category: condition, feedback})
              break
            default:
              res.render('search', {menus, pages, first: 1, nextPage: 2, page: 1, totalPage, keyword, category: condition, feedback})
              break
          }
          //return res.render('search', {menus, keyword, category: condition, feedback})
        } else {
          feedback = '未發現!!!'
          return res.render('search', {keyword, category: condition, feedback})
        }
      })
      .catch(error => console.log(error))
  }

  // condition is empty
  feedback = '請選擇條件!!!'
  res.render('search', {keyword, feedback })
})


//setting edit page
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(menu => res.render('edit', { menu }))
    .catch(error => console.log(error))
})

// setting edit function
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const newMenu = req.body
  const {name, name_en, category, image, location, phone, google_map, rating, description } = newMenu 
  return Restaurant.findById(id)
    .then(menu => {
      [ menu.name, menu.name_en, menu.category, menu.image, menu.location, menu.phone, menu.google_map, menu.rating, menu.description ] = 
      [ name, name_en, category, image,  location, phone, google_map, rating, description]      
      return menu.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
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


//for render paginator
function getPaginatorPages(menus, currentPage = 1) {
  const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
  const pages = []

  let startPage = 1
  let maxLastPage = totalPage

  if (totalPage > 5) {
    if (currentPage <= 3) {
      startPage = 1
      maxLastPage = 5
    } else if ((currentPage + 1) === totalPage) {
      startPage = currentPage - 3
      maxLastPage = currentPage + 1
    } else if (currentPage === totalPage) {
      startPage = currentPage - 4
      maxLastPage = totalPage
    } else if (currentPage > 3) {
      startPage = currentPage - 2
      maxLastPage = currentPage + 2
    }
  }

  for (let i = startPage; i <= maxLastPage; i++) {
    pages.push(i)
  }
  return pages
}

//render msnus; default page = 1
function getRenderByPage(menus, page = 1) {
  const startIndex = (page - 1) * PER_PAGE_MENU
  return menus.slice(startIndex, startIndex + PER_PAGE_MENU)
}

//for render paginator by search
function getSearchPaginatorPages(menus, currentPage, condition, keyword) {
  const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
  const pages = []

  let startPage = 1
  let maxLastPage = totalPage

  if (totalPage > 5) {
    if (currentPage <= 3) {
      startPage = 1
      maxLastPage = 5
    } else if ((currentPage + 1) === totalPage) {
      startPage = currentPage - 3
      maxLastPage = currentPage + 1
    } else if (currentPage === totalPage) {
      startPage = currentPage - 4
      maxLastPage = totalPage
    } else if (currentPage > 3) {
      startPage = currentPage - 2
      maxLastPage = currentPage + 2
    }
  }

  for (let i = startPage; i <= maxLastPage; i++) {
    pages.push({
      page: i,
      condition,
      keyword
    })
  }
  return pages
}



function getRenderBySearchPaginator(res, condition, keyword, page, feedback) {
  page = Number(page)
  //condition  = name
  if (condition === 'name') {
    return Restaurant.find({'name': {'$regex': keyword, '$options': '$i'}})
      .lean()
      .then(menus => {
        const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
        const pages =  getSearchPaginatorPages(menus, page, condition, keyword)
        menus = getRenderByPage(menus, page )
        let previousPage, nextPage
        
        switch (page) {
          case 1:
            if (totalPage > 1) {   //totalPage > 1, the nextPage will show
              nextPage = page  +  1
              res.render('search', {menus, pages, first: 1, page, nextPage, totalPage, keyword, name: condition, feedback})
            } else {
              res.render('search', {menus, pages, first: 1, page, totalPage, keyword, name: condition, feedback})
            }
            break
          case totalPage:
            previousPage = page  - 1
            res.render('search', {menus, pages, end: 1, page, previousPage, totalPage, keyword, name: condition, feedback})
            break
          default:
            nextPage = page  + 1
            previousPage = page  - 1
            res.render('search', {menus, pages, middle: 1, page, previousPage, nextPage,totalPage, keyword, name: condition, feedback})
            break
        }
      })
      .catch(error => console.log(error))
  } 

  if (condition === 'category') {
    return Restaurant.find({'category': {'$regex': keyword, '$options': '$i'}})
      .lean()
      .then(menus => {
        const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
        const pages =  getSearchPaginatorPages(menus, page, condition, keyword)
        menus = getRenderByPage(menus, page )
        let previousPage, nextPage
        
        switch (page) {
          case 1:
            if (totalPage > 1) {   //totalPage > 1, the nextPage will show
              nextPage = page  +  1
              res.render('search', {menus, pages, first: 1, page, nextPage, totalPage, keyword, category: condition, feedback})
            } else {
              res.render('search', {menus, pages, first: 1, page, totalPage, keyword, category: condition, feedback})
            }
            break
          case totalPage:
            previousPage = page  - 1
            res.render('search', {menus, pages, end: 1, page, previousPage, totalPage, keyword, category: condition, feedback})
            break
          default:
            nextPage = page  + 1
            previousPage = page  - 1
            res.render('search', {menus, pages, middle: 1, page, previousPage, nextPage, totalPage, keyword, category: condition, feedback})
            break
        }
      })
      .catch(error => console.log(error))
  }
}
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')
const PER_PAGE_MENU = 12

//index
router.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then(menus => {
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getPaginatorPages(menus)
      menus = getRenderByPage(menus)
      switch (totalPage) {
        case 1: 
          res.render('index', { menus, pages, first: 1, currentPage: 1, totalPage })
          break
        default:   //totalPage > 1, the nextPage will show
          res.render('index', { menus, pages, first: 1, nextPage: 2, currentPage: 1, totalPage })
          break
      } 
    })
    .catch(error => console.log(error))
})

//setting index paginator function
router.get('/index/:currentPage', (req, res) => {
  let currentPage = Number(req.params.currentPage)    
  return Restaurant.find()
    .lean()
    .then(menus => {
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getPaginatorPages(menus, currentPage) 
      menus = getRenderByPage(menus, currentPage)
      let previousPage, nextPage  
      switch (currentPage) {
        case 1:           //首頁
          if (totalPage > 1) {   //totalPage > 1, the nextPage will show
            nextPage = currentPage + 1
            res.render('index', {menus, pages, first: 1, nextPage, currentPage, totalPage})
          } else {
            res.render('index', { menus, pages, first: 1, currentPage: 1, totalPage })
          }
          break
        case totalPage:   //最後一頁
          previousPage = currentPage - 1
          res.render('index', {menus, pages, end: 1, previousPage,  currentPage, totalPage})
          break
        default:         //中間的部分
          nextPage = currentPage + 1
          previousPage = currentPage - 1
          res.render('index', {menus, pages, middle: 1, previousPage, nextPage,  currentPage, totalPage})
          break
      }      
    })
})

//setting search function 
router.get('/search', (req, res) => {
  const condition = req.query.condition
  const keyword = req.query.keyword
  const currentPage= req.query.page
  let feedback = ''
  
  if (currentPage !== undefined) {
    return getRenderBySearchPaginator(res, condition, keyword, currentPage, feedback)
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
              res.render('search', {menus, pages, first: 1, currentPage: 1, totalPage, keyword, name: condition, feedback})
              break
            default:
              res.render('search', {menus, pages, first: 1, nextPage: 2, currentPage: 1, totalPage, keyword, name: condition, feedback})
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
              res.render('search', {menus, pages, first: 1, currentPage: 1, totalPage, keyword, category: condition, feedback})
              break
            default:
              res.render('search', {menus, pages, first: 1, nextPage: 2, currentPage: 1, totalPage, keyword, category: condition, feedback})
              break
          }
          
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
function getRenderByPage(menus, currentPage = 1) {
  const startIndex = (currentPage - 1) * PER_PAGE_MENU
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

function getRenderBySearchPaginator(res, condition, keyword, currentPage, feedback) {
  currentPage = Number(currentPage)
  //condition  = name
  if (condition === 'name') {
    return Restaurant.find({'name': {'$regex': keyword, '$options': '$i'}})
      .lean()
      .then(menus => {
        const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
        const pages =  getSearchPaginatorPages(menus, currentPage, condition, keyword)
        feedback = `發現:${menus.length}筆`
        menus = getRenderByPage(menus, currentPage )
        let previousPage, nextPage
        
        switch (currentPage) {
          case 1:
            if (totalPage > 1) {   //totalPage > 1, the nextPage will show
              nextPage = currentPage  +  1
              res.render('search', {menus, pages, first: 1, currentPage, nextPage, totalPage, keyword, name: condition, feedback})
            } else {
              res.render('search', {menus, pages, first: 1, currentPage, totalPage, keyword, name: condition, feedback})
            }
            break
          case totalPage:
            previousPage = currentPage - 1
            res.render('search', {menus, pages, end: 1, currentPage, previousPage, totalPage, keyword, name: condition, feedback})
            break
          default:
            nextPage = currentPage + 1
            previousPage = currentPage  - 1
            res.render('search', {menus, pages, middle: 1, currentPage, previousPage, nextPage,totalPage, keyword, name: condition, feedback})
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
        const pages =  getSearchPaginatorPages(menus, currentPage, condition, keyword)
        feedback = `發現:${menus.length}筆`
        menus = getRenderByPage(menus, currentPage)
        let previousPage, nextPage
        
        switch (currentPage) {
          case 1:
            if (totalPage > 1) {   //totalPage > 1, the nextPage will show
              nextPage = currentPage  +  1
              res.render('search', {menus, pages, first: 1, currentPage, nextPage, totalPage, keyword, category: condition, feedback})
            } else {
              res.render('search', {menus, pages, first: 1, currentPage, totalPage, keyword, category: condition, feedback})
            }
            break
          case totalPage:
            previousPage = currentPage  - 1
            res.render('search', {menus, pages, end: 1, currentPage, previousPage, totalPage, keyword, category: condition, feedback})
            break
          default:
            nextPage = currentPage + 1
            previousPage = currentPage  - 1
            res.render('search', {menus, pages, middle: 1, currentPage, previousPage, nextPage, totalPage, keyword, category: condition, feedback})
            break
        }
      })
      .catch(error => console.log(error))
  }
}


module.exports = router
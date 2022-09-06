const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')
const PER_PAGE_MENU = 12

//  index
router.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then(menus => {
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getPaginatorPages(menus)
      menus = getRenderByPage(menus)
      switch (totalPage) {
        case 1:
          res.render('index', { menus, pages, first: 1, currentPage: 1, totalPage, index: 1 })
          break
        default: //  totalPage > 1, the nextPage will show
          res.render('index', { menus, pages, first: 1, nextPage: 2, currentPage: 1, totalPage, index: 1 })
          break
      }
    })
    .catch(error => console.log(error))
})

//  首頁分頁
router.get('/index/:currentPage', (req, res) => {
  const currentPage = Number(req.params.currentPage)
  return Restaurant.find()
    .lean()
    .then(menus => {
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getPaginatorPages(menus, currentPage)
      menus = getRenderByPage(menus, currentPage)
      let previousPage, nextPage
      switch (currentPage) {
        case 1: //  首頁
          if (totalPage > 1) { //  totalPage > 1, the nextPage will show
            nextPage = currentPage + 1
            res.render('index', { menus, pages, first: 1, nextPage, currentPage, totalPage, index: 1 })
          } else {
            res.render('index', { menus, pages, first: 1, currentPage: 1, totalPage, index: 1 })
          }
          break
        case totalPage: //  最後一頁
          previousPage = currentPage - 1
          res.render('index', { menus, pages, end: 1, previousPage, currentPage, totalPage, index: 1 })
          break
        default: //  中間的部分
          nextPage = currentPage + 1
          previousPage = currentPage - 1
          res.render('index', { menus, pages, middle: 1, previousPage, nextPage, currentPage, totalPage, index: 1 })
          break
      }
    })
    .catch(error => console.log(error))
})

//  setting search function
router.get('/search', (req, res) => {
  const condition = req.query.condition
  const keyword = req.query.keyword
  const currentPage = req.query.page
  const sort = req.query.sort
  let feedback = ''
  const conditionObj = {} //  搜尋條件物件
  const sortObject = {} //  排序物件，用於前端顯示紀錄
  const sortOpt = {} //  mongoose排序條件
  const whereOpt = {} //  mongoose搜尋條件

  //  根據排序名稱，選定mongoose排序條件、排序物件
  switch (sort) {
    case 'category':
      sortOpt.category = 1
      sortObject.category = sort
      break
    case 'location':
      sortOpt.location = 1
      sortObject.location = sort
      break
    case 'ratingUp':
      sortOpt.rating = -1
      sortObject.ratingUp = sort
      break
    case 'ratingDown':
      sortOpt.rating = 1
      sortObject.ratingDown = sort
      break
  }

  //  根據搜尋條件，選定mongoose搜尋條件
  switch (condition) {
    case 'name':
      conditionObj.name = condition
      whereOpt.name = { $regex: keyword, $options: '$i' }
      break
    case 'category':
      conditionObj.category = condition
      whereOpt.category = { $regex: keyword, $options: '$i' }
      break
    default:
      feedback = '請選擇條件!!!'
      return res.render('search', { keyword, feedback, sortObject })
  }

  //  如果出現分頁
  if (currentPage !== undefined) {
    return getRenderBySearchPaginator(res, condition, keyword, currentPage, feedback, conditionObj, whereOpt, sortOpt, sortObject, sort)
  }

  //  如果關鍵字為空
  if (keyword.trim().length === 0) {
    feedback = '請輸入關鍵字!'
    return res.render('search', { keyword, feedback, condition: conditionObj, sortObject })
  }

  return Restaurant.find(whereOpt)
    .lean()
    .sort(sortOpt)
    .then(menus => {
      if (menus.length !== 0) {
        const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
        const pages = getSearchPaginatorPages(menus, 1, condition, keyword, sort)
        feedback = `發現:${menus.length}筆`
        menus = getRenderByPage(menus)
        switch (totalPage) {
          case 1:
            res.render('index', { menus, pages, first: 1, currentPage: 1, totalPage, keyword, condition: conditionObj, feedback, sortObject, sort })
            break
          default:
            res.render('index', { menus, pages, first: 1, nextPage: 2, currentPage: 1, totalPage, keyword, condition: conditionObj, feedback, sortObject, sort })
            break
        }
      } else {
        feedback = '未發現!!!'
        return res.render('index', { keyword, condition: conditionObj, feedback, sortObject })
      }
    })
    .catch(error => console.log(error))
})

//  組成首頁分頁導覽列
function getPaginatorPages (menus, currentPage = 1) {
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

//  render msnus; default page = 1
function getRenderByPage (menus, currentPage = 1) {
  const startIndex = (currentPage - 1) * PER_PAGE_MENU
  return menus.slice(startIndex, startIndex + PER_PAGE_MENU)
}

//  組成搜尋分頁導覽列
function getSearchPaginatorPages (menus, currentPage, condition, keyword, sort) {
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
      keyword,
      sort
    })
  }
  return pages
}

//  搜尋分頁
function getRenderBySearchPaginator (res, condition, keyword, currentPage, feedback, conditionObj, whereOpt, sortOpt, sortObject, sort) {
  currentPage = Number(currentPage)
  return Restaurant.find(whereOpt)
    .lean()
    .sort(sortOpt)
    .then(menus => {
      const totalPage = Math.ceil(menus.length / PER_PAGE_MENU)
      const pages = getSearchPaginatorPages(menus, currentPage, condition, keyword, sort)
      feedback = `發現:${menus.length}筆`
      menus = getRenderByPage(menus, currentPage)
      let previousPage, nextPage
      switch (currentPage) {
        case 1:
          if (totalPage > 1) { //  totalPage > 1, the nextPage will show
            nextPage = currentPage + 1
            res.render('index', { menus, pages, first: 1, currentPage, nextPage, totalPage, keyword, condition: conditionObj, feedback, sortObject, sort })
          } else {
            res.render('index', { menus, pages, first: 1, currentPage, totalPage, keyword, condition: conditionObj, feedback, sortObject, sort })
          }
          break
        case totalPage:
          previousPage = currentPage - 1
          res.render('index', { menus, pages, end: 1, currentPage, previousPage, totalPage, keyword, condition: conditionObj, feedback, sortObject, sort })
          break
        default:
          nextPage = currentPage + 1
          previousPage = currentPage - 1
          res.render('index', { menus, pages, middle: 1, currentPage, previousPage, nextPage, totalPage, keyword, condition: conditionObj, feedback, sortObject, sort })
          break
      }
    })
    .catch(error => console.log(error))
}

module.exports = router

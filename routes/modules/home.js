const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')
const { getRestaurantsPagination, getPaginatorPages, getOffset, PER_PAGE_MENU } = require('../../helpers/pagination-helpers')

//  首頁
router.get('/', async (req, res, next) => {
  const userId = req.user._id
  const total = await Restaurant.countDocuments({ userId }).lean()
  const offset = getOffset(PER_PAGE_MENU)
  
  return Restaurant.find({ userId })
    .lean()
    .limit(PER_PAGE_MENU)
    .skip(offset)
    .then(menus => {
      const totalPage = Math.ceil(total / PER_PAGE_MENU)
      const pages = getPaginatorPages(totalPage)
      getRestaurantsPagination(res, menus, pages, totalPage)
    })
    .catch(err => next(err))
})

//  首頁分頁
router.get('/index/:currentPage', async (req, res, next) => {
  const currentPage = Number(req.params.currentPage)
  const userId = req.user._id
  const total = await Restaurant.countDocuments({ userId }).lean()
  const offset = getOffset(PER_PAGE_MENU, currentPage)

  return Restaurant.find({ userId })
    .lean()
    .limit(PER_PAGE_MENU)
    .skip(offset)
    .then(menus => {
      const totalPage = Math.ceil(total / PER_PAGE_MENU)
      const pages = getPaginatorPages(totalPage, currentPage)
      getRestaurantsPagination(res, menus, pages, totalPage, currentPage)
    })
    .catch(err => next(err))
})

//  搜尋、搜尋分頁
router.get('/search', async (req, res, next) => {
  const userId = req.user._id
  const condition = req.query.condition
  const keyword = req.query.keyword
  const currentPage = req.query.page ? Number(req.query.page) : 1 // 沒有默認從第一頁開始
  const sort = req.query.sort
  let feedback = ''
  const conditionObj = {} //  搜尋條件物件
  const sortObject = {} //  排序物件，用於前端顯示紀錄
  const sortOpt = {} //  mongoose排序條件
  const whereOpt = {} //  mongoose搜尋條件

  //  根據排序名稱，選定mongoose排序條件、排序物件
  switch (sort) {
    case 'category':
      sortOpt.category = 'desc'
      sortObject.category = sort
      break
    case 'location':
      sortOpt.location = 'desc'
      sortObject.location = sort
      break
    case 'ratingUp':
      sortOpt.rating = 'desc'
      sortObject.ratingUp = sort
      break
    case 'ratingDown':
      sortOpt.rating = 'asc'
      sortObject.ratingDown = sort
      break
  }

  //  根據搜尋條件，選定mongoose搜尋條件
  switch (condition) {
    case 'name':
      conditionObj.name = condition
      whereOpt.name = { $regex: keyword, $options: '$i' }
      whereOpt.userId = userId
      break
    case 'category':
      conditionObj.category = condition
      whereOpt.category = { $regex: keyword, $options: '$i' }
      whereOpt.userId = userId
      break
    default:
      feedback = '請選擇條件!!!'
      return res.render('index', { keyword, feedback, sortObject })
  }

  //  如果關鍵字為空
  if (keyword.trim().length === 0) {
    feedback = '請輸入關鍵字!'
    return res.render('index', { keyword, feedback, condition: conditionObj, sortObject })
  }

  const total = await Restaurant.countDocuments(whereOpt).lean()
  const offset = getOffset(PER_PAGE_MENU, currentPage)

  return Restaurant.find(whereOpt)
    .lean()
    .sort(sortOpt)
    .limit(PER_PAGE_MENU)
    .skip(offset)
    .then(menus => {
      if (menus.length !== 0) {
        const totalPage = Math.ceil(total / PER_PAGE_MENU)
        const pages = getPaginatorPages(totalPage, currentPage, condition, keyword, sort)
        feedback = `發現:${total}筆`
        getRestaurantsPagination(res, menus, pages, totalPage, currentPage, keyword, sort, conditionObj, sortObject, feedback)
      } else {
        feedback = '未發現!!!'
        return res.render('index', { keyword, condition: conditionObj, feedback, sortObject })
      }
    })
    .catch(err => next(err))
})

module.exports = router

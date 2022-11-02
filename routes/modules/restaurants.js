const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')
const { imageUrlValidator, ratingValidator } = require('../../helpers/validation-helpers')

//  create page
router.get('/new', (req, res) => {
  res.render('new')
})

//  setting create function
router.post('/new', async (req, res, next) => {
  const userId = req.user._id
  const menu = req.body
  const { image, rating } = menu
  menu.userId = userId
  
  const errors = []
  //  imageUrl字串篩選
  if (!imageUrlValidator(image)) errors.push({ message: '圖片格式僅接受png、jpg、jpeg' })

  // rating篩選
  if (!ratingValidator(rating)) errors.push({ message: 'rating 範圍1~5，小數點取一位' })

  //  如果有錯誤
  if (errors.length) {
    return res.render('new', { menu, errors })
  }
  
  //  預防rating 遭暴力攻擊
  if (Number(rating) % 1 !== 0) {
    menu.rating = Number(rating).toFixed(1)  // 小數點後1位
  }

  return Restaurant.create(menu)
    .then(() => res.redirect('/'))
    .catch(err => next(err))
})

//  setting read detail function
router.get('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(menu => {
      res.render('show', { menu })
    })
    .catch(err => next(err))
})

//  setting edit page
router.get('/:id/edit', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(menu => res.render('edit', { menu }))
    .catch(err => next(err))
})

//  setting edit function
router.put('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  const newMenu = req.body
  const { name, name_en, category, image, location, phone, google_map, rating, description } = newMenu

  const errors = []
  // imageUrl字串篩選
  const isValidFormat = imageUrlValidator(image)
  if (!isValidFormat) errors.push({ message: '圖片格式僅接受png、jpg、jpeg' })

  // rating篩選
  if (!ratingValidator(rating)) errors.push({ message: 'rating 範圍1~5，小數點取一位' })
  
  //  如果有錯誤
  if (errors.length) {
    req.flash('errors', errors)
    return res.redirect(`/restaurants/${_id}/edit`)
  }

  return Restaurant.findOne({ _id, userId })
    .then(menu => {
      [menu.name, menu.name_en, menu.category, menu.image, menu.location, menu.phone, menu.google_map, menu.rating, menu.description] =
      [name, name_en, category, image, location, phone, google_map, rating, description]
      return menu.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => next(err))
})

//  setting delete function
router.delete('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(menu => menu.remove())
    .then(() => res.redirect('/'))
    .catch(err => next(err))
})

module.exports = router

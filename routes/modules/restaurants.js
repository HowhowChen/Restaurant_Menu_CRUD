const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')


//  create page
router.get('/new', (req, res) => {
  res.render('new')
})

//  setting create function
router.post('/new', (req, res, next) => {
  const userId = req.user._id
  const menu = req.body
  menu.userId = userId
  if (Number(menu.rating) % 1 !== 0) {
    menu.rating = Number(menu.rating).toFixed(1)  // 小數點後1位
  }

  return Restaurant.create(menu)
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      next(err)
    })
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
    .catch(err => {
      console.log(err)
      next(err)
    })
})

//  setting edit page
router.get('/:id/edit', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(menu => res.render('edit', { menu }))
    .catch(err => {
      console.log(err)
      next(err)
    })
})

//  setting edit function
router.put('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  const newMenu = req.body
  const { name, name_en, category, image, location, phone, google_map, rating, description } = newMenu
  return Restaurant.findOne({ _id, userId })
    .then(menu => {
      [menu.name, menu.name_en, menu.category, menu.image, menu.location, menu.phone, menu.google_map, menu.rating, menu.description] =
      [name, name_en, category, image, location, phone, google_map, rating, description]
      return menu.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => {
      console.log(err)
      next(err)
    })
})

//  setting delete function
router.delete('/:id', (req, res, next) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(menu => menu.remove())
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      next(err)
    })
})

module.exports = router

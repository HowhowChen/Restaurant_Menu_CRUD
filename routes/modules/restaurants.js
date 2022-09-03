const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

//  create page
router.get('/new', (req, res) => {
  res.render('new')
})

//  setting create function
router.post('/new', (req, res) => {
  const menu = req.body
  return Restaurant.create(menu)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//  setting read detail function
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(menu => {
      res.render('show', { menu })
    })
    .catch(error => console.log(error))
})

//  setting edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(menu => res.render('edit', { menu }))
    .catch(error => console.log(error))
})

//  setting edit function
router.put('/:id', (req, res) => {
  const id = req.params.id
  const newMenu = req.body
  const { name, name_en, category, image, location, phone, google_map, rating, description } = newMenu
  return Restaurant.findById(id)
    .then(menu => {
      [menu.name, menu.name_en, menu.category, menu.image, menu.location, menu.phone, menu.google_map, menu.rating, menu.description] =
      [name, name_en, category, image, location, phone, google_map, rating, description]
      return menu.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//  setting delete function
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(menu => menu.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
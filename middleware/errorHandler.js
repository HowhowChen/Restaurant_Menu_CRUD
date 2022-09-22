module.exports = {
  errorHandler: (err, req, res, next) => {
    res.status(404)
    res.redirect('/error')
  }
}

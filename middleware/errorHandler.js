module.exports = {
  errorHandler: (err, req, res, next) => {
    res.redirect('/error')
  }
}

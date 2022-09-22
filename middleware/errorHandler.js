module.exports = {
  errorHandler: (err, req, res, next) => {
    const status = err.status || 404
    res.status(status)
    res.render('error', { errMsg: err.message })
  }
}

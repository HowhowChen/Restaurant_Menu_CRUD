function imageUrlValidator (image) {
  const validFormat = new Array('png', 'jpg', 'jpeg')
  const imageSplitArr = image.split('.')
  const imageFormat = imageSplitArr[imageSplitArr.length - 1]
  const isValidFormat = validFormat.some(f => f === imageFormat)

  return isValidFormat
}

module.exports = {
  imageUrlValidator
}

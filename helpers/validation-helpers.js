function imageUrlValidator (image) {
  const validFormat = new Array('png', 'jpg', 'jpeg')
  const imageSplitArr = image.split('.')
  const imageFormat = imageSplitArr[imageSplitArr.length - 1]
  const isValidFormat = validFormat.some(f => f === imageFormat)

  return isValidFormat
}

function ratingValidator (rating) {
  const isValidRating = Number(rating) < 5 ? rating.match(/^[1-4]+(.[0-9]{1})?$/) : rating.match(/^[5]+(.[0]{1})?$/) 

  return isValidRating
}

module.exports = {
  imageUrlValidator,
  ratingValidator
}

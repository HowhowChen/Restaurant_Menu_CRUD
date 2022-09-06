const ratingSort = document.querySelector('#rating-sort')
const dataPanel = document.querySelector('#data-panel')
const menus = document.querySelectorAll('.menu')
const currentPage = document.querySelector('#current-page')// current page
const pagination = document.querySelectorAll('.page-item')
const menuObject = []

/* sort function */
try {
  ratingSort.addEventListener('change', event => {
    const value = event.target.value
    sortMenusByRating(value)
  })
} catch {}

/* show current page on pagination */
for (let i = 0; i < pagination.length; i++) {
  if (pagination[i].innerText === currentPage.textContent) {
    pagination[i].classList.add('active')
  }
}

/* 排序 */
function sortMenusByRating (value) {
  for (let i = 0; i < menus.length; i++) {
    menuObject.push({
      rating: menus[i].dataset.rating,
      html: menus[i]
    })
  }

  /* 內建sort方法 */
  menuObject.sort((a, b) => {
    switch (value) {
      case 'up': //  高 -> 低
        return b.rating - a.rating
      case 'down': //  低 -> 高
        return a.rating - b.rating
    }
  })

  menuObject.forEach(item => {
    dataPanel.appendChild(item.html)
  })
}

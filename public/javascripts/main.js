const ratingSort = document.querySelector('#rating-sort')
const dataPanel = document.querySelector('#data-panel')
const menus = document.querySelectorAll('#menu')
const page = document.querySelector('#page')   //current page
const pagination = document.querySelectorAll('.page-item')
const menuObject = []

/*sort function*/
try {
  ratingSort.addEventListener('change', event => {
    const value = event.target.value
    if (value === 'up') {
      sortUpToDown()
    } else if (value === 'down') {
      sortDownToUp()
    }
  })
} catch {
  
}

/*show current page on pagination*/
for (let i = 0; i < pagination.length; i++) {
  if (pagination[i].innerText === page.textContent) {
    pagination[i].classList.add('active')
  }
}




//高到低
function sortUpToDown() {
  for (let i = 0; i < menus.length; i++) {
    menuObject.push({
      rating: menus[i].dataset.id,
      html: menus[i]
    })
  }

  /*高 -> 低*/
  menuObject.sort((a, b) => {
    return b.rating - a.rating
  })

  menuObject.forEach(item => {
    dataPanel.appendChild(item.html)
  })
  
}
  

//低到高
function sortDownToUp() {
  for (let i = 0; i < menus.length; i++) {
    menuObject.push({
      rating: menus[i].dataset.id,
      html: menus[i]
    })
  }

  /*低 -> 高*/
  menuObject.sort((a, b) => {
    return a.rating - b.rating
  })

  menuObject.forEach(item => {
    dataPanel.appendChild(item.html)
  })
}




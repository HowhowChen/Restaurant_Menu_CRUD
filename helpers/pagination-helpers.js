const PER_PAGE_MENU = 6
const DEFAULT_PAGINATOR_NAVBAR_START = 1  //  分頁導覽列從第一頁開始(固定)
const PAGINATOR_NAVBAR_COUNT = 5  //  分頁導覽列顯示數量
const MIDDLE_PAGINATOR_NAVBAR_COUNT = 3 //  導覽列中間頁數量
const MIDDLE_PAGINATOR_NAVBAR_RANGE_STAY_PAGE = 2 // 在超過中間頁後導覽列向前、後保持頁數
const LAST_PAGINATOR_NAVBAR_STAY_PAGE = 4 // 在最尾頁時，導覽列向前保持頁數

const getOffset = (limit = 6, currentPage = 1) => (currentPage - 1) * limit

function getRestaurantsPagination (res, menus, pages, totalPage, currentPage = 1, keyword = null, sort = null, conditionObj = null, sortObject = null, feedback = null ) {
  const previousPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  const index = conditionObj ? null : true

  switch (currentPage) {
    case 1: //  首頁
      if (totalPage > 1) { //  totalPage > 1, the nextPage will show
        res.render('index', { menus, pages, first: 1, nextPage, currentPage, totalPage, index, keyword, sort, condition: conditionObj, sortObject, feedback })
      } else {
        res.render('index', { menus, pages, first: 1, currentPage: 1, totalPage, index, keyword, sort, condition: conditionObj, sortObject, feedback })
      }
      break
    case totalPage: //  最後一頁
      res.render('index', { menus, pages, end: 1, previousPage, currentPage, totalPage, index, keyword, sort, condition: conditionObj, sortObject, feedback })
      break
    default: //  中間的部分
      res.render('index', { menus, pages, middle: 1, previousPage, nextPage, currentPage, totalPage, index, keyword, sort, condition: conditionObj, sortObject, feedback })
      break
  }
}

//  組成首頁分頁導覽列
function getPaginatorPages (totalPage, currentPage = 1, condition = null, keyword = null, sort = null) {
  const pages = []
  let startPage = DEFAULT_PAGINATOR_NAVBAR_START
  let maxLastPage = totalPage

  if (totalPage > PAGINATOR_NAVBAR_COUNT) {
    if (currentPage <= MIDDLE_PAGINATOR_NAVBAR_COUNT) {
      startPage = DEFAULT_PAGINATOR_NAVBAR_START
      maxLastPage = PAGINATOR_NAVBAR_COUNT
    } else if ((currentPage + DEFAULT_PAGINATOR_NAVBAR_START) === totalPage) {
      startPage = currentPage - MIDDLE_PAGINATOR_NAVBAR_COUNT
      maxLastPage = currentPage + DEFAULT_PAGINATOR_NAVBAR_START
    } else if (currentPage === totalPage) {
      startPage = currentPage - LAST_PAGINATOR_NAVBAR_STAY_PAGE
      maxLastPage = totalPage
    } else if (currentPage > MIDDLE_PAGINATOR_NAVBAR_COUNT) {
      startPage = currentPage - MIDDLE_PAGINATOR_NAVBAR_RANGE_STAY_PAGE
      maxLastPage = currentPage + MIDDLE_PAGINATOR_NAVBAR_RANGE_STAY_PAGE
    }
  }

  for (let i = startPage; i <= maxLastPage; i++) {
    pages.push({
      page: i,
      condition,
      keyword,
      sort
    })
  }
  return pages
}

module.exports = {
  getRestaurantsPagination,
  getPaginatorPages,
  getOffset,
  PER_PAGE_MENU
}

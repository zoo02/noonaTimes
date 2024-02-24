let myApiKey = `cc6b987313df4d658e45a474e4342ead`
// let myApiKey = `fee45e5ba3b947ee8fd2797d07bcd1e3`
let newsList = []
let menuButtons = document.querySelectorAll(".menus button")
let sideMenuListButtons = document.querySelectorAll(".sideMenuList button")
let searchInput = document.getElementById("searchInput")
let word = ""
let searchButton = document.getElementById("searchBtn")
searchButton.disabled = true
searchButton.addEventListener("click", () => {
	searchKeyWord(word)
})
searchInput.addEventListener("input", () => {
	searchButton.disabled = searchInput.value.length == 0
	word = searchInput.value
})

let url = new URL(
	// 누나api -> 과제 제출용
	`https://nntimes.netlify.app//top-headlines?country=kr`

	// 뉴스 api -> 과제 테스트용
	// `https://newsapi.org/v2/top-headlines?country=kr&pagesize=10&apiKey=${myApiKey}`
)


// 페이지네이션, 초기에 내가 설정해줄 수 있는 값들
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5

const pagination = () => {
	// ex) totalResult에 102개의 기사를 받았다고 치자, 102개를 한 페이지에 10개씩만 보여주려면
	// 102 / 10 = 10...2 결과가 나오는데 ...2에 대한 기사는 버릴 수 없으니 Math.ceil()로 올림처리를 해줘야한다
	// 그래서 전체 페이지의 수는 11이 된다
	let totalPages = Math.ceil(totalResults / pageSize)

	// 전체 페이지가 11개이다. 페이지 10개씩 몇 개의 그룹이 있는지 구한다
	let totalGroup = Math.ceil(totalPages / groupSize)
	
	// 현재 페이지 번호와 그룹 크기를 기반으로 현재 페이지가 속해있는 그룹을 찾는다
	let pageGroup = Math.ceil(page / groupSize)

	// 마지막 페이지가 전체 페이지보다 크면 전체 페이지까지만 보여줘야한다!
	let lastPage = pageGroup * groupSize
	if (lastPage > totalPages){
		lastPage = totalPages
	}
	// 0번째 페이지는 없다 첫 화면에서 시작 페이지가 0일 경우 1로 바꿔주자
	let firstPage = lastPage - (groupSize - 1)
	if (firstPage <= 0){
		 firstPage = 1 

	}

	let paginationHTML = ``

	if (pageGroup > 1) {
		let previousPage = firstPage - 1
		paginationHTML += `<li class="page-item" onClick="moveToPage(${previousPage})"><a class="page-link" href="#"><</a></li>`
	} 
	
	for(let i = firstPage; i <= lastPage; i++){
		paginationHTML += `<li class="page-item ${i == page ? "active" : "" }" onClick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`
	}
	
	if (pageGroup < totalGroup){
		let nextPage = lastPage + 1
		paginationHTML += `<li class="page-item" onClick="moveToPage(${nextPage})"><a class="page-link" href="#">></a></li>`
	}
	document.querySelector(".pagination").innerHTML = paginationHTML

}

let moveToPage = (pageNumber) => {
	page = pageNumber
	getLatestNews()
}


const getLatestNews = async () => {
	try {
		url.searchParams.set("page", page)
		url.searchParams.set("pageSize", pageSize)
		const response = await fetch(url)
		const data = await response.json()

		if (response.status === 200){
			if (data.totalResults === 0) {
				throw new Error("No Result For This Search")
			}
			newsList = data.articles
			totalResults = data.totalResults
			render()
			pagination()

		} else {
			throw new Error(data.message)
		}
	} catch (error) {
		errorMessage(error.message)
	}
}
getLatestNews()


async function moveToCategory(event) {
	const currentCategory = event.target.id
	
	url = new URL(
		// 누나api -> 과제 제출용
		`https://nntimes.netlify.app/top-headlines?country=kr&category=${currentCategory}`
		
		// 뉴스 api -> 과제 테스트용
		// `https://newsapi.org/v2/top-headlines?country=kr&category=${currentCategory}&apiKey=${myApiKey}`
		)
		getLatestNews()
	}

async function searchKeyWord(word) {
	url = new URL(
		// 누나api -> 과제 제출용
		`https://nntimes.netlify.app/top-headlines?country=kr&q=${word}`
			
		// 뉴스 api -> 과제 테스트용
		// `https://newsapi.org/v2/top-headlines?country=kr&q=${word}&apiKey=${myApiKey}`
		)
		getLatestNews()
	}
		
		// 화면에 보여주는 함수
const render = () => {
	const newsHtml = newsList
	.map((news) => {
	let displayDescription = ""
				
	if (news.description && news.description.length <= 200) {
	displayDescription = news.description
					

	} else if (!news.description || news.description.length === 0) {
	displayDescription = "내용 없음"
	} else {
	displayDescription = `${news.description.substr(0, 200)}...`
	}
				
	const imageUrl = news.urlToImage
	? news.urlToImage
	: "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"

	const hasSource = news.source?.name ? news.source.name : "no source"
				
	const publishedTime = moment(news.publishedAt, "HH:mm:ss").fromNow(true)
				
		return ` 
		<div class= "row news" >
		<div class="col-lg-4">
		<img class="newsImgSize"
		src=${imageUrl} />
		</div>
		<div class="col-lg-8">
		<h2>${news.title}</h2>
		<p>
		${displayDescription}
		</p>
		<div>
		${hasSource} * ${publishedTime}
		</div>
		</div>
		</div> `
	})
	.join("")
			
	document.getElementById("newsBoard").innerHTML = newsHtml
	}
		

const errorMessage = (errorMessage) => {
	const errorHtml = `<div class="alert alert-danger" role="alert">
	${errorMessage}
	</div>`
			
	document.getElementById("newsBoard").innerHTML = errorHtml
}		
		
menuButtons.forEach((menu) => menu.addEventListener("click", moveToCategory))
sideMenuListButtons.forEach((menu) => menu.addEventListener("click", moveToCategory))
function toggleNav() {
	let sideNav = document.getElementById("mySideNav");
	if (sideNav.style.width == "250px") {
		closeNav()
	} else {
		openNav()
	}
}
const closeNav = () => document.getElementById("mySideNav").style.width = "0"
const openNav = () => document.getElementById("mySideNav").style.width = "250px"

const openSearchBox = () => {
	let inputArea = document.getElementById("inputArea")
	if (inputArea.style.display === "inline") {
		inputArea.style.display = "none"
	} else {
		inputArea.style.display = "inline"
	}
}

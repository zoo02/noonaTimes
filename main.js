// let myApiKey = `cc6b987313df4d658e45a474e4342ead`
let myApiKey = `fee45e5ba3b947ee8fd2797d07bcd1e3`
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
	// `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${myApiKey}`
)

// 에러상황이 발생했을 때 처리해줄 로직
const getLatestNews = async () => {
	try {
		const response = await fetch(url)
		const data = await response.json()


		// response object의 status가 200이면 정상적으로 뉴스 불러오기
		if (response.status === 200){

			// 검색 키워드가 없는 뉴스를 검색했을 때 error메세지 보여줘야해
			// else가 아니고 if문 안에 if문인 이유는 status에러 없이 data를 잘 받아오는 상황에서 에러가 발생하는 경우이기 때문에
			if (data.totalResults === 0) {
				throw new Error("No Result For This Search")
			}
			// 코드의 중복 없이 짜보자. response.status === 200이 참이면 밑에 if문 들어갔다가 바로 빠져나올것이야
			newsList = data.articles
			render()

		// response object의 status가 200이 아닌 400,401,402 등등 이라면 받은 에러 메세지를 화면에 보여주자
		} else {
			throw new Error(data.message)
		}

	// 받은 api 데이터가 0개라면 화면에 'no matches for your search' 메세지 띄우기
	} catch (error) {
		errorMessage(error.message)
	}
}
getLatestNews()

menuButtons.forEach((menu) => menu.addEventListener("click", moveToCategory))
sideMenuListButtons.forEach((menu) => menu.addEventListener("click", moveToCategory))

// 카테고리 클릭하면 해당 카테고리 기사들만 볼 수 있게
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

// 검색창에 키워드가 입력되고, 검색 버튼이 클릭 되었을 때 실행할 함수
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

				// 뉴스 내용이 없으면 내용 없음 표시하기
			} else if (!news.description || news.description.length === 0) {
				displayDescription = "내용 없음"
			} else {
				// 200 글자 이상일 경우 200글자까지 자르고 ... 붙여주기
				displayDescription = `${news.description.substr(0, 200)}...`
			}

			// 이미지가 없다면 no image 보여주기
			const imageUrl = news.urlToImage
				? news.urlToImage
				: "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
			// 출처가 없다면 출처 없음이라고 알려주기
			const hasSource = news.source?.name ? news.source.name : "no source"

			// 발행한 시간이 언제인지 알고, 몇 시간 전인지 알려주기
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

// error상황에서 유저에게 보여줄 메세지
// catch 블록에서 받아온 error객체의 message속성을 파라미터로 받음
const errorMessage = (errorMessage) => {
	const errorHtml = `<div class="alert alert-danger" role="alert">
  	${errorMessage}
	</div>`

	document.getElementById("newsBoard").innerHTML = errorHtml
}


// html 햄버거 슬라이드/검색박스 onClick()
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

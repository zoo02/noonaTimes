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

let url = new URL (
    // 누나api -> 과제 제출용
    `https://nntimes.netlify.app//top-headlines?country=kr`

    // 뉴스 api -> 과제 테스트용
    // `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${myApiKey}`
)


const getLatestNews = async () => {
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
    render()
}
getLatestNews()

menuButtons.forEach ((menu) => menu.addEventListener("click", moveToCategory))
sideMenuListButtons.forEach((menu) => menu.addEventListener("click", moveToCategory))

// 카테고리 클릭하면 해당 카테고리 기사들만 볼 수 있게
async function moveToCategory (event) {
    const currentCategory = event.target.id

    url = new URL(
        // 누나api -> 과제 제출용
        `https://nntimes.netlify.app//top-headlines?country=kr&category=${currentCategory}`

        // 뉴스 api -> 과제 테스트용
        // `https://newsapi.org/v2/top-headlines?country=kr&category=${currentCategory}&apiKey=${myApiKey}`
        )
    getLatestNews()
}

// 검색창에 키워드가 입력되고, 검색 버튼이 클릭 되었을 때 실행할 함수
async function searchKeyWord(word) {
    url = new URL(
    // 누나api -> 과제 제출용
    `https://nntimes.netlify.app//top-headlines?country=kr&q=${word}`
    
    // 뉴스 api -> 과제 테스트용
    // `https://newsapi.org/v2/top-headlines?country=kr&q=${word}&apiKey=${myApiKey}`
    )
    getLatestNews()
}

// 화면에 보여주는 함수
const render = () => {
    const newsHtml = newsList.map(
        (news) => {

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
            const imageUrl = news.urlToImage ? news.urlToImage : "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
            // 출처가 없다면 출처 없음이라고 알려주기
            const hasSource = news.source?.name ? news.source.name : "no source";

            // 발행한 시간이 언제인지 알고, 몇 시간 전인지 알려주기
            const publishedTime = moment(news.publishedAt, "HH:mm:ss").fromNow(true);

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
        }).join("")

    document.getElementById("newsBoard").innerHTML = newsHtml
}



const closeNav = () => {
    document.getElementById("mySideNav").style.width = "0";
};

const openNav = () => {
    document.getElementById("mySideNav").style.width = "250px";
};

const openSearchBox = () => {
    let inputArea = document.getElementById("inputArea");
    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }
};
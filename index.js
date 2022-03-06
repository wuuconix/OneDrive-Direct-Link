let input = document.querySelector("input[placeholder]")
let a = document.querySelector("a")
let checkbox = document.querySelector("input[type='checkbox']")
let shareLink = ""
let shareCode = ""
let shortCode = ""

let displayLink = (code) => {
    a.innerHTML = `https://1drv.conix.tk/${code}`
    a.href = `https://1drv.conix.tk/${code}`
    a.classList.remove("hide")
}

input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        shareLink = input.value
        shareCode = shareLink.split("/").slice(-1)[0].slice(0, 46)
        console.log(`Your ShareCode is \n${shareCode}`)
        if (checkbox.checked == false) { //用户不需要短链，使用正常 shareCode
            displayLink(shareCode)
            navigator.clipboard.writeText(a.href)
            console.log("Your Direct Link is auto paste to your clipboard")

        } else { //默认。使用shortCode
            axios.get(`https://1drv.conix.tk/${shareCode}?s=1`).then(function (response) {
                shortCode = response.data["shortcode"]
                console.log(`Your ShortCode is \n${shortCode}`)
                displayLink(shortCode)
                navigator.clipboard.writeText(a.href)
                console.log("Your Direct Link is auto pasted to your clipboard")
            })
        }
    }
})
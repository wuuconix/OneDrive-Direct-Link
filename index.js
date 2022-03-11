let input = document.querySelector("input[placeholder]")
let a = document.querySelector("a")
let checkbox1 = document.querySelectorAll("input[type='checkbox']")[0] //是否custom 即1drv.conix.tk
let checkbox2 = document.querySelectorAll("input[type='checkbox']")[1] //是否用shortcode
let checkbox3 = document.querySelectorAll("input[type='checkbox']")[2] //是否Preview

let shareLink = "" //https://uconix-my.sharepoint.com/:i:/g/personal/conix_conix_tk/EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig?e=ggi2zZ
let domain = "" //uconix-my.sharepoint.com
let username = "" //conix_conix_tk
let type = "" // :i:
let shareCode = "" //EZyke9CHRJVBvYnZVv5B9XgBZ5nFlDOabxR9OMY7kzbGig
let shortCode = "" //0XDx
let previewList = [":v:", ":i:", ":u:"] //支持视频、图片、音频、pdf

let displayLink = link => {
    a.innerHTML = link
    a.href = link
    a.classList.remove("hide")
    navigator.clipboard.writeText(link)
}

let notice = msg => {
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
           let notification = new Notification(msg)
        }
    });
}

input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        shareLink = input.value
        let splitList = shareLink.split("/")
        domain = splitList[2]
        username = splitList[6]
        type = splitList[3]
        shareCode = splitList[7].slice(0, 46)

        if (username == "conix_conix_tk" && checkbox1.checked == true) { //武丑兄个人使用并且勾选custom
            if (checkbox2.checked == false) { //用户不需要短链，使用正常 shareCode
                if (checkbox3.checked == false || !previewList.includes(type)) { //用户不需要预览或者不支持的格式
                    displayLink(`https://1drv.conix.tk/${shareCode}`)
                    notice(`${username} 你好\n直链已经复制到您的剪切板`)
                }
                else { 
                    switch (type) {
                        case ":v:":
                            displayLink(`https://v.conix.tk/?url=https://1drv.conix.tk/${shareCode}`)
                            notice(`${username} 你好\n视频预览链接已经复制到您的剪切板`)
                            break
                        case ":i:":
                            displayLink(`https://p.conix.tk/?url=https://1drv.conix.tk/${shareCode}`)
                            notice(`${username} 你好\n图片预览链接已经复制到您的剪切板`)
                            break
                        case ":u:":
                            displayLink(`https://p.conix.tk/?url=https://1drv.conix.tk/${shareCode}`)
                            notice(`${username} 你好\n音频预览链接已经复制到您的剪切板`)
                            break
                    }

                }
            } else { //默认。使用shortCode
                fetch(`https://1drv.conix.tk/${shareCode}?s=1`)
                    .then( response => response.json())
                    .then(json => {
                        shortCode = json.shortcode
                        if (checkbox3.checked == false || !previewList.includes(type)) { //用户不需要预览
                            displayLink(`https://1drv.conix.tk/${shortCode}`)
                            notice(`${username} 你好\n直链已经复制到您的剪切板`)
                        }
                        else { //用于需要预览
                            switch (type) {
                                case ":v:":
                                    displayLink(`https://v.conix.tk/?url=https://1drv.conix.tk/${shortCode}`)
                                    notice(`${username} 你好\n视频预览链接已经复制到您的剪切板`)
                                    break
                                case ":i:":
                                    displayLink(`https://p.conix.tk/?url=https://1drv.conix.tk/${shortCode}`)
                                    notice(`${username} 你好\n图片预览链接已经复制到您的剪切板`)
                                    break
                                case ":u:":
                                    displayLink(`https://p.conix.tk/?url=https://1drv.conix.tk/${shortCode}`)
                                    notice(`${username} 你好\n音频预览链接已经复制到您的剪切板`)
                                    break
                            }
                        }
                    })
            }
        }
        else { //其他人使用或者没有勾选custom
            let directLink = `https://${domain}/personal/${username}/_layouts/15/download.aspx?share=${shareCode}`
            if (checkbox2.checked == false || !previewList.includes(type)) {
                displayLink(directLink)
                notice(`${username} 你好\n直链已经复制到您的剪切板`)
            }
            else {
                displayLink(`https://v.conix.tk/?url=${directLink}`)
                notice(`${username} 你好\n视频预览链接已经复制到您的剪切板`)
                switch (type) {
                    case ":v:":
                        displayLink(`https://v.conix.tk/?url=${directLink}`)
                        notice(`${username} 你好\n视频预览链接已经复制到您的剪切板`)
                        break
                    case ":i:":
                        displayLink(`https://p.conix.tk/?url=${directLink}`)
                        notice(`${username} 你好\n图片预览链接已经复制到您的剪切板`)
                        break
                    case ":u:":
                        displayLink(`https://p.conix.tk/?url=${directLink}`)
                        notice(`${username} 你好\n音频预览链接已经复制到您的剪切板`)
                        break
                }
            }
        }
    }
})

checkbox1.addEventListener("change", () => {
    if (checkbox1.checked == true) {
        document.querySelectorAll("p")[1].style.display = "inline"
    }
    else {
        document.querySelectorAll("p")[1].style.display = "none"
    }
})
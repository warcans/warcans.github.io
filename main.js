var streamerFetch = await fetch("streamers.json")
var streamers = await streamerFetch.json()

const url = 'https://gist.githubusercontent.com/warcans/be6d1af29fba88ee1d458feff9bb7641/raw/live_status.json'
// var live_statusFetch = await fetch("live_status.json")
var live_statusFetch

loadXMLDoc()

var live_status = JSON.parse(live_statusFetch)

// var live_status = await live_statusFetch.json()

const template = document.querySelector("#default-card")

const wrapper = document.createDocumentFragment("div")

const fileExt = [".jpg", ".png"]

streamers.forEach(user => {
    const clone = template.content.cloneNode(true)
    
    const img = clone.querySelector("#photo")
    img.src = user.image

    clone.querySelector("#card-link").href = "https://twitch.tv/" + user.name
    clone.querySelector("#username").textContent = user.name
    clone.querySelector("#description").textContent = user.description

    var twitter = clone.querySelector("#twitter")
    var bluesky = clone.querySelector("#bluesky")
    var youtube = clone.querySelector("#youtube")
    var tiktok = clone.querySelector("#tiktok")
    var discord = clone.querySelector("#discord")

    if (user.twitter != null) twitter.href = "https://twitter.com/" + user.twitter
    else twitter.remove()

    if (user.bluesky != null) bluesky.href = "https://bsky.app/profile/" + user.bluesky
    else bluesky.remove()

    if (user.youtube != null) youtube.href = "https://youtube.com/" + user.youtube
    else youtube.remove()

    if (user.tiktok != null) tiktok.href = "https://tiktok.com/" + user.tiktok
    else tiktok.remove()

    if (user.discord != null) discord.href = "https://discord.com/" + user.discord
    else discord.remove()

    clone.querySelector("#bgcolor").style = "background: linear-gradient(120deg, #202020 , " + user.color1 + ");"

    // SET LIVE STATUS
    clone.querySelector("#live-status").textContent = "OFFLINE"
    live_status.forEach(key =>{
        if (key.user_name.toLowerCase() == user.name.toLowerCase()){
            clone.querySelector("#live-status").textContent = "LIVE"
            if (key.is_minecraft == "true" && key.is_amigis == "true"){
                clone.querySelector("#live-status").textContent = "AMIGI"
            }
        }
    })
    wrapper.appendChild(clone);
})

function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                live_statusFetch = xmlhttp.responseText;
            }
            else if (xmlhttp.status == 400) {
                alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    }

    xmlhttp.open("GET", url, false)
    xmlhttp.send()
}

document.querySelector(".streamers").appendChild(wrapper)

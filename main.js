var streamerFetch = await fetch("streamers.json")
var streamers = await streamerFetch.json()

// LIVE PUBLISH
const url = 'https://gist.githubusercontent.com/warcans/be6d1af29fba88ee1d458feff9bb7641/raw/live_status.json'
var live_statusFetch
loadXMLDoc()
var live_status = JSON.parse(live_statusFetch)

// DEV
// var live_statusFetch = await fetch("live_status.json")
// var live_status = await live_statusFetch.json()

const template = document.querySelector("#default-card")

const wrapper_all = document.createDocumentFragment("div")
const wrapper_live = document.createDocumentFragment("div")
const wrapper_not_live = document.createDocumentFragment("div")
const wrapper_amigi = document.createDocumentFragment("div")
const wrapper_not_amigi = document.createDocumentFragment("div")

const fileExt = [".jpg", ".png"]

streamers.forEach(user => {
    const clone = template.content.cloneNode(true)

    var filter = true
    var live = false
    var amigi = false

    const img = clone.querySelector("#photo")
    img.src = user.image

    const links = clone.querySelectorAll("#card-link")

    links.forEach(e =>{
        e.href = "https://twitch.tv/" + user.name
    })

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

    var card_style = "background: linear-gradient(180deg, #404040 25%, " + user.color1 + "80 75%);"

    // SET LIVE STATUS
    clone.querySelector("#live-status").textContent = "OFFLINE"
    live_status.forEach(key =>{
        if (key.user_name.toLowerCase() == user.name.toLowerCase()){
            live = true
            clone.querySelector("#live-status").textContent = "● LIVE"
            clone.querySelector("#live-status").style = "color:red;text-shadow:red 0px 0px 15px"
            card_style += ";box-shadow: 0px 0px 10px 0px red"

            var a = clone.getElementById("bgcolor")
            a.setAttribute("status", "live")

            if (key.is_minecraft == "true" && key.is_amigis == "true"){
                amigi = true
                clone.querySelector("#live-status").textContent = "● AMIGI"
                clone.querySelector("#live-status").style = "color:lime;text-shadow:0px 0px 15px"
                card_style += ";box-shadow: 0px 0px 10px 0px lime"

                a.setAttribute("status", "amigi")
            }
        }
    })

    clone.querySelector("#bgcolor").style = card_style
    if (filter){
        if (amigi == true){
            wrapper_amigi.appendChild(clone)
        }
        if (live == true){
            wrapper_live.appendChild(clone)
        }
    }
    wrapper_all.appendChild(clone);
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
document.querySelector(".streamers").appendChild(wrapper_amigi)
document.querySelector(".streamers").appendChild(wrapper_live)
document.querySelector(".streamers").appendChild(wrapper_all)

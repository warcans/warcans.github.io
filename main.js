const streamerFetch = await fetch("streamers.json")
const streamers = await streamerFetch.json()

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

    wrapper.appendChild(clone)
});

document.querySelector(".streamers").appendChild(wrapper)
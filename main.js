// Fetch streamer data; works local dev and github
var streamerFetch = await fetch("streamers.json")
var streamers = await streamerFetch.json()

//// LIVE VERSION
//// URL needs to be the URL to which backend serves data
const url = 'https://gist.githubusercontent.com/warcans/be6d1af29fba88ee1d458feff9bb7641/raw/live_status.json'
var live_statusFetch
loadXMLDoc()
var live_status = JSON.parse(live_statusFetch)

//// DEV VERSION
// var live_statusFetch = await fetch("live_status.json")
// var live_status = await live_statusFetch.json()

// This is the card template
const template = document.querySelector("#default-card")
const social_template = document.querySelector("#social-link")

// Wrappers for each status. Used for filtering
const wrapper_all = document.createDocumentFragment("div")
const wrapper_live = document.createDocumentFragment("div")
const wrapper_amigi = document.createDocumentFragment("div")

// Short for social_channels
const social_channels = streamers.social_channels

streamers.streamers.forEach(user => {
    const clone = template.content.cloneNode(true)

    var filter = true   // Sets cards in order of: AMIGI > LIVE > OFFLINE
    var live = false    // Gets true if user is live
    var amigi = false   // Gets true if user is live, playing minecraft and includes "amigis" in title

    // Set user photo
    const img = clone.querySelector("#photo")
    img.src = user.image

    // Set twitch link to card and photo
    const links = clone.querySelectorAll("#card-link")
    links.forEach(e => { e.href = "https://twitch.tv/" + user.name })

    // Set username and description
    clone.querySelector("#username").textContent = user.name
    clone.querySelector("#description").textContent = user.description

    // Get social media elements
    const social_container = clone.querySelector(".card-links")
    const social_wrapper = document.createDocumentFragment("div")

    // Add a social media link for each mentioned for user in streamers.json
    for (var social in user.socials){

        // Copy template
        const  user_social = social_template.content.cloneNode(true)
        var service
        var icon

        // Loop through configured socials in .json to find the correct data
        social_channels.forEach(channel =>{
            if (channel.name == social){
                service = channel.prefix
                icon = channel.icon
            }
        })

        // Set link and icon
        user_social.querySelector("#social").href = "" + service + user
        user_social.querySelector("#social-icon").src = icon

        // Add to template
        social_wrapper.appendChild(user_social)
    }

    // Apply template to card
    social_container.appendChild(social_wrapper)

    // Set card background to user color
    var card_style = "background: " + user.color1 + ";"

    // Set live status and configure card effects
    var card_status = clone.querySelector("#live-status")
    card_status.textContent = "OFFLINE"

    live_status.forEach(key =>{

        // if user is live
        if (key.user_name.toLowerCase() == user.name.toLowerCase()){
            live = true
            var animation_length = ((100/key.game.length*key.game.length)/600) / (1/(key.game.length+26))
            card_status.textContent = key.game.toUpperCase()
            card_status.style = "color:red;text-shadow:red 0px 0px 15px;animation: my-animation linear infinite " + animation_length + "s;"
            card_style += ";box-shadow: 0px 0px 10px 0px red"
            var a = clone.getElementById("bgcolor")
            a.setAttribute("status", "live")

            // if user is playing minecraft and has amigi in title
            if (key.is_minecraft == "true" && key.is_amigis == "true"){
                amigi = true
                var amigi_text = "AMIGI MINECRAFT"
                card_status.textContent = amigi_text
                animation_length = ((100/amigi_text.length*amigi_text.length)/600) / (1/(amigi_text.length+26))
                card_status.style = "color:lime;text-shadow:0px 0px 15px;animation: my-animation linear infinite " + animation_length + "s;"
                card_style += ";box-shadow: 0px 0px 10px 0px lime;"
                a.setAttribute("status", "amigi")
            }
        }
    })

    // Set card effects
    clone.querySelector("#bgcolor").style = card_style

    // Set static font for offline users
    if (live == false) clone.querySelector(".card-live-status").style = "display:flex;justify-content:center;"

    // Add users in filtering order
    if (filter){
        if (amigi == true){
            wrapper_amigi.appendChild(clone)
        }
        if (live == true){
            wrapper_live.appendChild(clone)
        }
    }

    // Add non-filtered users to all
    wrapper_all.appendChild(clone);
})

// Add cards to website
document.querySelector(".streamers").appendChild(wrapper_amigi)
document.querySelector(".streamers").appendChild(wrapper_live)
document.querySelector(".streamers").appendChild(wrapper_all)

// Fetch live data from GIST
// Backend is completely separate from anything and hosted in Oracle Cloud
// It uses the users from streamers.json to fetch data from twitch API
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

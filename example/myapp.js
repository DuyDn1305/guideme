const config = {
	apiKey: "AIzaSyDejD_sOSrt_GSGjyxDJj40nGTYCaJ5MJI",
	authDomain: "guideme1.firebaseapp.com",
	databaseURL: "https://guideme1.firebaseio.com",
	projectId: "guideme1",
	storageBucket: "guideme1.appspot.com",
	messagingSenderId: "283911475239",
	appId: "1:283911475239:web:d08fa5d4aa81e905"
}
firebase.initializeApp(config);

let db = firebase.database();

db.ref()

let userPos = {}

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: userPos.lat, lng: userPos.lng},
        zoom: 16,
        styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
    });
    map.addListener("click", e => {
        console.log(e)
        console.log(e.latLng.lat)
        placeMarker(e.latLng, map)
    })
}

// iconULR = ../img/{visitor, guide, busy}.png
function placeMarker(latLng, map, iconURL = "../img/guide.png") {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map, 
      icon: {
        url: iconURL, 
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(48, 48),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(24, 24)
      }, 
      shape: {
        coords: [20, 0, 20, 20, 0, 30, 0, 48, 48, 48, 48, 30, 28, 30, 28, 0],
        type: 'poly'
      }
    })
    marker.addListener('click', e => {
        console.log(e)
    })
}

function getUserPos (user) {
    let tmp = document.getElementById("map")
    console.log('run function')
        if (navigator.geolocation) {
            tmp.innerHTML += "watch"+"<br>"    
            navigator.geolocation.getCurrentPosition(pos => {
                userPos.lat = pos.coords.latitude
                userPos.lng = pos.coords.longitude
                console.log(pos.coords.latitude+" "+pos.coords.longitude)
                console.log(tmp)
                tmp.innerHTML += pos.coords.latitude+" "+pos.coords.longitude+"<br>"
                //db.ref("position/"+user.uid+'/geolocation').update({lat: pos.coords.latitude, lng: pos.coords.longitude})
            },
             e => {
                tmp.innerHTML += "cannot get curren"+"<br>"
                for (let k in e) {
                    tmp.innerHTML += e[k]+"<br>"
                }
            })
        }
        else {
            tmp.innerHTML += "error"+"<br>"    
        }
}

function creatingScript (cb) {
    let script = document.createElement('script')
    db.ref("key").once("value", snap => {
        key = snap.val()
        script.src = "https://maps.googleapis.com/maps/api/js?key="+key+"&callback=initMap"
        document.body.append(script)
        script.onload = () => {
            cb()
        }
    })
}

firebase.auth().onAuthStateChanged(currentUser => {
	if (currentUser) {
        /*
        db.ref("position/").on("child_changed", snap => {
            console.log(snap.key + " #changed")
            console.log(snap.val())
            console.log("")
        })
        db.ref("position/").on("child_added", snap => {
            console.log(snap.key + " #added")
            console.log(snap.val())
            console.log("")
        })
        */
    }
})


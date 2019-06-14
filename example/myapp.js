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
		zoom: 16
    });
    MySubclass.prototype = new google.maps.MVCObject();
    map.addListener("click", e => {
        console.log(e)
        console.log(e.latLng.lat)
        placeMarker(e.latLng, map)
    })
}


function marker(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
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
            navigator.geolocation.watchPosition(pos => {
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

firebase.auth().onAuthStateChanged(currentUser => {
	if (currentUser) {
        
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
        
    }
})


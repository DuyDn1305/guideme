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
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
}

function getMyPos () {
    navigator.geolocation
}

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

//$(() => {
	/*
	const form = document.getElementById('message-form');
	const messageField = document.getElementById('message');
	const messagesList = document.getElementById('messages');
	const socketStatus = document.getElementById('status');
	const closeBtn = document.getElementById('close');

  let reqHandler = new RequestHandler('app.js');
	reqHandler.on('Open', event => {
		socketStatus.innerHTML = `Connected to: ${event.currentTarget.url}`;
		socketStatus.className = 'open';
	})

	reqHandler.on('Error', error => {
		console.log(`WebSocket Error: ${error}`);
	})

	form.onsubmit = e => {
	e.preventDefault(); 

		var message = messageField.value;

		reqHandler.send(message);

		messageField.value = '';
	};

	reqHandler.on('Request', data => {
	//messagesList.innerHTML += '<li class="received">' + data.data + '</li>';
	console.log(data.sender + ': ' + data.data);
	});

	reqHandler.on('Close', event => {
		socketStatus.innerHTML = 'Disconnected from WebSocket.';
		socketStatus.className = 'closed';
	});

	closeBtn.onclick = e => {
		e.preventDefault();
		reqHandler.close();
	};
//});
*/
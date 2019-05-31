const config = {
  apiKey: "AIzaSyDejD_sOSrt_GSGjyxDJj40nGTYCaJ5MJI",
  authDomain: "guideme1.firebaseapp.com",
  databaseURL: "https://guideme1.firebaseio.com",
  projectId: "guideme1",
  storageBucket: "guideme1.appspot.com",
  messagingSenderId: "283911475239",
  appId: "1:283911475239:web:d08fa5d4aa81e905"
};
firebase.initializeApp(config);

function newElement(type, classname = '', context = '') {
	let newEle = document.createElement(type)
	newEle.setAttribute('class', classname)
	newEle.innerHTML = context
	return newEle
}

let db = firebase.database();
let user, userList, chat, ready = [];

let header, menu, message, notiBtn, chatContainer, mesOnMesBox, containerSearch, cardContainer, toolbarCard, logOut, profilePane, xMap, map, infoWindow;

ready.push(flag => {
	if (flag) return;
	chat = new WebChat(user.uid);
	header = document.getElementsByClassName('header')[0]
	menu = header.children[1]
	messageContainer = menu.children[0]
	notiContainer = menu.children[1]
	chatContainer = document.body.getElementsByClassName('chat-container')[0]
	mesOnMesBox = []
	containerSearch = document.body.children[2].children[2].children[1]
	cardContainer = containerSearch.children[0]
	logOut = menu.lastElementChild
	profilePane = document.getElementsByClassName('profile')[0]
	xMap = document.getElementsByClassName('map')[0];
  /*
  loadScript('./src/googleapi.js', () => {
	// load map
	let script = document.createElement('script')
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCxmtSpYlPsOcoFz9knDyQwCbtanPjtwkU&callback=initMap"
	script.async = 'defer'
	document.body.children[1].children[1].removeChild(document.body.children[1].children[1].lastChild)
	document.body.children[1].children[1].append(script)
	focusMe()
  })
  */
  //renderMap()
})

ready.push(guideme_chat);
ready.push()

firebase.auth().onAuthStateChanged(currentUser => {
	if (currentUser) {
		user = currentUser;
		let flag = 0, proBarWidth = 0, addition = 100.0 / ready.length;
		let progBar = document.getElementById('progressBar');

		db.ref('user').on('value', snap => {
			userList = {};
			snap = snap.val();
			for (let k in snap) userList[k] = snap[k];
			ready.forEach(e => {
				e(flag);
				if (proBarWidth < 100) {
					proBarWidth += addition;
					progBar.style.width = Math.round(proBarWidth) + '%';
					if (proBarWidth >= 100) progBar.style.backgroundColor = '#4267b2';
				}
			});
			flag = 1;
		});
	} else {
		console.log('logged out');
		window.location = './mainpage'
	}
});

console.log('index.js');
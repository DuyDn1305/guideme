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
let proBarWidth = 0, proBarAddition, progBar = document.getElementById('progressBar');
let header, menu, message, notiBtn, chatContainer, mesOnMesBox, containerSearch, cardContainer, toolbarCard, logOut, profilePane, xMap, map, infoWindow;

function incProBar() {
	proBarWidth += proBarAddition;
    progBar.style.width = Math.round(proBarWidth) + '%';
    if (proBarWidth >= 100) progBar.style.backgroundColor = '#4267b2';
}

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
	
    incProBar();
})

ready.push(guideme_chat);
ready.push(guideme_card);
ready.push(guideme_googleApi);
ready.push(guideme_logout);
ready.push(guideme_showInfo);

firebase.auth().onAuthStateChanged(currentUser => {
	if (currentUser) {
		user = currentUser;
		let flag = 0;
		proBarAddition = 100.0 / ready.length;

		db.ref('user').on('value', snap => {
			userList = {};
			snap = snap.val();
			for (let k in snap) userList[k] = snap[k];
			ready.forEach(e => {
				e(flag);
			});
			flag = 1;
		});
	} else {
		console.log('logged out');
		window.location = './mainpage'
	}
});
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

function addLeadingZero(value) {
	value = value.toString();
	if (value.length == 1) value = '0' + value;
	return value;
}

const dayName = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
function getTimeFormat(value, needDayName = 1) {
	let res = (needDayName ? (dayName[value.getDay()] + ' ') : '') + addLeadingZero(value.getDate()) + '/' + addLeadingZero(value.getMonth() + 1) + '/' + (value.getFullYear() % 100) + ' lúc ';
	res += addLeadingZero(value.getHours()) + ':' + addLeadingZero(value.getMinutes());
	return res;
}

function newElement(type, classname, context = '') {
	let newEle = document.createElement(type)
	if (classname) newEle.setAttribute('class', classname)
	if (classname) newEle.innerHTML = context
	return newEle
}

let db = firebase.database();
let user, userList, chat, firstLoad = 0, ready = [], reqList;
let proBarWidth = 0, proBarAddition, progBar = document.getElementById('progressBar');
let header, menu, message, chatContainer, containerSearch, cardContainer, logOut, profilePane, xMap, map, infoWindow
let messageContainer, notiContainer, reqContainer, reqBox, notiBox, mesBox, popupContainer
let searchInput, reqListRef
let filter = {
	'visitor': false,
	'guide': false,
	'avail': true
};

function incProBar() {
	proBarWidth += proBarAddition;
	progBar.style.width = Math.round(proBarWidth) + '%';
	if (proBarWidth >= 100) progBar.style.backgroundColor = '#4267b2';
}

function filterCard() {
	function filterValid(id) {
		if (!filter.avail) return filter[userList[id].moreinfo.type];
		return filter[userList[id].moreinfo.type] && userList[id].isBusy == 0;
	}

	let root = cardContainer.children, pattern = searchInput.value.toLowerCase();
	if (pattern == '') {
		for (let i = 0; i < root.length; ++i) {
			if (filterValid(root[i].getAttribute('cardid'))) root[i].style.display = 'block';
			else root[i].style.display = 'none';
		}
	} else {
		for (let i = 0; i < root.length; ++i) {
			let card = root[i];
			try {
				if (!filterValid(card.getAttribute('cardid')) || $(card).find('.name').text().toLowerCase().search(pattern) == -1) card.style.display = 'none';
				else card.style.display = 'block';
			} catch(e) {
				card.style.display = 'none';
			}
		}
	}
}

ready.push(() => {
	if (firstLoad) return;
	chat = new WebChat(user.uid);
	//reqHandler = new RequestHandler()
	header = document.getElementsByClassName('header')[0]
	// menu
	menu = header.children[1]
	messageContainer = menu.children[0]
	notiContainer = menu.children[1]
	reqContainer = menu.children[2]
	// chat
	chatContainer = document.body.getElementsByClassName('chat-container')[0]
	// popupContainer
	popupContainer = document.body.getElementsByClassName('popupContainer')[0]
	//filter
	if (user.moreinfo.type == 'visitor') {
		$('#guide').attr('checked', true);
		filter.guide = true;
	} else if (user.moreinfo.type == 'guide') {
		$('#visitor').attr('checked', true);
		filter.visitor = true;
	}

	$('.filter').children('.type').find("[type='checkbox']").click(function() {
		filter[this.getAttribute('id')] = this.checked;
		filterCard();
	})
	// card pane
	searchInput = document.getElementsByClassName('inp')[0];
	searchInput.oninput = () => filterCard();
	document.getElementsByClassName('fa-eraser')[0].onclick = () => {
		searchInput.value = '';
		filterCard();
	}
	cardContainer = document.body.children[1].children[2].children[1].children[0]
	logOut = menu.lastElementChild
	// profile pane
	profilePane = document.getElementsByClassName('profile')[0]
	// center
	xMap = document.getElementsByClassName('map')[0];
	
  	incProBar();
})

ready.push(guideme_notiHandler)
ready.push(guideme_popupHandler)
ready.push(guideme_menuHandler)
ready.push(guideme_card)
ready.push(guideme_request)
ready.push(guideme_showInfo)
ready.push(guideme_chat)
//ready.push(guideme_googleApi)
ready.push(guideme_logout)
ready.push(guideme_showReqList)
ready.push(guideme_trip)

firebase.auth().onAuthStateChanged(currentUser => {
	if (currentUser) {
		proBarAddition = 100.0 / ready.length;
		db.ref('user').on('value', snap => {
			userList = snap.val()
			user = userList[currentUser.uid]
			ready.forEach(e => e())
			firstLoad = 1
		})
	} else {
		console.log('logged out');
		window.location = './mainpage'
	}
});
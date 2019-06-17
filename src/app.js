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
function getTimeFormat(value, needDayName = true) {
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
let user, userList, chat, firstLoad = 0, ready = [], reqList, userDataLog = [], markers = [], arrAppoint = [];
let proBarWidth = 0, proBarAddition, progBar = document.getElementById('progressBar');
let header, menu, message, chatContainer, containerSearch, cardContainer, logOut, profilePane, xMap, map, infoWindow
let messageContainer, notiContainer, reqContainer, reqBox, notiBox, mesBox, popupContainer
let searchInput, reqListRef;
let filter = {
	'visitor': false,
	'guide': false,
	'avail': true
};
let styles = {
	default: null,
	silver: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
	retro: [{"elementType":"labels","stylers":[{"visibility":"off"},{"color":"#f49f53"}]},{"featureType":"landscape","stylers":[{"color":"#f9ddc5"},{"lightness":-7}]},{"featureType":"road","stylers":[{"color":"#813033"},{"lightness":43}]},{"featureType":"poi.business","stylers":[{"color":"#645c20"},{"lightness":38}]},{"featureType":"water","stylers":[{"color":"#1994bf"},{"saturation":-69},{"gamma":0.99},{"lightness":43}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#f19f53"},{"weight":1.3},{"visibility":"on"},{"lightness":16}]},{"featureType":"poi.business"},{"featureType":"poi.park","stylers":[{"color":"#645c20"},{"lightness":39}]},{"featureType":"poi.school","stylers":[{"color":"#a95521"},{"lightness":35}]},{},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"color":"#813033"},{"lightness":38},{"visibility":"off"}]},{},{},{},{},{},{},{},{},{},{},{},{"elementType":"labels"},{"featureType":"poi.sports_complex","stylers":[{"color":"#9e5916"},{"lightness":32}]},{},{"featureType":"poi.government","stylers":[{"color":"#9e5916"},{"lightness":46}]},{"featureType":"transit.station","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","stylers":[{"color":"#813033"},{"lightness":22}]},{"featureType":"transit","stylers":[{"lightness":38}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#f19f53"},{"lightness":-10}]},{},{},{}],
	blue: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}],
	hiding: [{featureType: 'poi.business',stylers: [{visibility: 'off'}]},{featureType: 'transit',elementType: 'labels.icon',stylers: [{visibility: 'off'}]}],
	night: [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}],
	hybrid: [{"featureType":"all","elementType":"all","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":-30}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#353535"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#656565"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#505050"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#808080"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#454545"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#66cc33"}]}],
	assasin: [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}],

}

function incProBar() {
	proBarWidth += proBarAddition;
	progBar.style.width = Math.round(proBarWidth) + '%';
	if (progBar.style.width == "100%") progBar.style.backgroundColor = '#4267b2';
}

function filterValid(id) {
	if (!filter.avail) return filter[userList[id].moreinfo.type];
	return filter[userList[id].moreinfo.type] && userList[id].isBusy == 0;
}

function filterCard() {
	let root = cardContainer.children, pattern = searchInput.value.toLowerCase(), card;
	if (pattern == '') {
		for (let i = 0; i < root.length; ++i) {
			card = root[i];
			if (filterValid(card.getAttribute('cardid'))) card.style.display = 'block';
			else card.style.display = 'none';
		}
	} else {
		for (let i = 0; i < root.length; ++i) {
			card = root[i];
			try {
				if (!filterValid(card.getAttribute('cardid')) || $(card).find('.name').text().toLowerCase().search(pattern) == -1) card.style.display = 'none';
				else card.style.display = 'block';
			} catch(e) {
				card.style.display = 'none';
			}
		}
	}
}

function initUserLog(id) {
	userDataLog[id] = {
		stars: 0,
		type: [0, 0, 0, 0, 0, 0], 
		cmt: 0,
		loadProfile: 0
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
ready.push(guideme_chat)
ready.push(guideme_logout)
ready.push(guideme_showReqList)
ready.push(guideme_editInfo)
ready.push(guideme_trip)
ready.push(guideme_map)

firebase.auth().onAuthStateChanged(currentUser => {
	if (currentUser) {
		proBarAddition = 100.0 / ready.length;
		db.ref('user').on('value', snap => {
			userList = snap.val()
			user = userList[currentUser.uid]
			ready.forEach(e => e())
			if (!firstLoad) console.log('loaded all guideme_function')
			firstLoad = 1
		})
	} else {
		console.log('logged out');
		window.location = './mainpage'
	}
});
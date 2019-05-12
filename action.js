// let messageButton = document.getElementById('mes-btn');
// let chatContainer = document.getElementById('chat-container')
let header = document.getElementsByClassName('header')[0]
let menu = header.children[1]
let mesBtn = menu.children[0]
let notiBtn = menu.children[1]
let chatContainer = document.body.getElementsByClassName('chat-container')[0]
let _room = document.querySelectorAll('[roomid]')
let mesOnMesBox = [
  {
    src: './img/duydn.png',
    name: 'DuyDn1',
    mes: 'Hello i am duy1',
    roomid: '111'
  },
  {
    src: './img/duydn.png',
    name: 'DuyDn2',
    mes: 'Hello i am duy2',
    roomid: '222'
  },
  {
    src: './img/duydn.png',
    name: 'DuyDn3',
    mes: 'Hello i am duy3',
    roomid: '333'
  }
]
let cardContainer = document.body.children[1].children[2].children[1].children[0]
let toolbarCard = document.querySelectorAll('[class~=toolbar]')
console.log(cardContainer)
console.log(toolbarCard)
toolbarCard.forEach((tool, index) => {
  console.log(tool)
  mesPressBtn = tool.children[1]
  mesPressBtn.onclick = () => {
    //add to mesBox
    let _src = './img/duydn.png'
    let _name = 'DuyDn'+index+index
    let _mes = 'Hello i am duy'+index+index
    let _roomid = '4321'+index
    mesOnMesBox.push({
      src: _src,
      name: _name,
      mes: _mes,
      roomid: _roomid
    })
    // close mesBox
    turnOff('mes-box')
    //remove
    if (chatContainer.childElementCount >= 2) chatContainer.removeChild(chatContainer.children[0])
    chatContainer.append(mesToChatContainer(_roomid, null, null, _name))
    _room = chatContainer.children
    mesToChatContainer(_roomid, null, null, _name)
  }
})
// console.log(notiBtn)

let mesBtnOn = 0
mesBtn.onclick = function () {
  if (mesBtnOn) {
    turnOff('mes-box')
  } else {
    turnOff('noti-box')
    turnOn('mes-box')
    mesOnMesBox.forEach(e => {
      showMes(e.src, e.name, e.mes, e.roomid)
    })
  }
}

let notiBtnOn = 0
notiBtn.onclick = function () {
  if (notiBtnOn) {
    turnOff('noti-box')
  } else {
    turnOff('mes-box')
    turnOn('noti-box')
  }
}

function turnOff (classname) {
  if (classname === 'mes-box') {
    if (mesBtnOn) {
      mesBtnOn = 0
      let box = document.getElementsByClassName('mes-box')[0]
      document.body.removeChild(box)
    }
  }
  if (classname === 'noti-box') {
    if (notiBtnOn) {
      notiBtnOn = 0
      let box = document.getElementsByClassName('noti-box')[0]
      document.body.removeChild(box)
    }
  }
}

function turnOn (classname) {
  if (classname === 'mes-box') mesBtnOn = 1
  if (classname === 'noti-box') notiBtnOn = 1
  let box = newElement('DIV', classname)
  document.body.appendChild(box)
}

function newElement (type, classname = '', context = '') {
  let newEle = document.createElement(type)
  newEle.setAttribute('class', classname)
  newEle.innerHTML = context
  return newEle
}

// show mes to chatContainer
function showMes (src, name, message, roomid) {
  // console.log(roomid)
  // tao avatar
  let avatarContainer = newElement('DIV', 'avatar-container')
  let avatar = newElement('IMG', 'avatar')
  avatar.src = src
  avatarContainer.appendChild(avatar)
  // tao info
  let infoContainer = newElement('DIV', 'info-container')
  let _name = newElement('P', 'name', name)
  let _mes = newElement('P', 'mes', message)
  infoContainer.appendChild(_name)
  infoContainer.appendChild(_mes)
  // tao thoi gian
  let _time = newElement('P', 'time', '9:00')
  // tao tin nhan
  let mes = newElement('DIV', 'mes-container')
  mes.appendChild(avatarContainer)
  mes.appendChild(infoContainer)
  mes.appendChild(_time)
  // bam vao mes o tren thi o duoi hien len
  mes.onclick = () => {
    if (chatContainer.childElementCount >= 2) chatContainer.removeChild(chatContainer.children[0])
    chatContainer.append(mesToChatContainer(roomid, null, null, name))
    _room = chatContainer.children
  }

  // hien mes len Mesager thong bao
  let box = document.getElementsByClassName('mes-box')[0]
  box.appendChild(mes)
}

function mesToChatContainer (roomid = '', messages = '', listPerson = '', roomName = roomid) {
  // tao chat trong chat-container
  let mes = newElement('DIV', 'chat')
  mes.setAttribute('roomid', roomid)
  // tao header
  let _header = newElement('DIV', 'header')
  // tao hinh
  let headerAvatarContainer = newElement('DIV', 'avatar-container')
  let headerAvatar = newElement('IMG', 'avatar')
  headerAvatar.src = './img/duydn.png'
  headerAvatarContainer.append(headerAvatar)
  // tao info
  let headerInfo = newElement('DIV', 'info')
  let headerName = newElement('P', 'name', roomName)
  let headerStatus = newElement('P', 'status', 'Active')
  headerInfo.append(headerName)
  headerInfo.append(headerStatus)
  // tao nut X
  let headerExit = newElement('P', 'exit', '&times;')
  headerExit.onclick = () => {
    chatContainer.removeChild(mes)
    _room = chatContainer.children
  }

  _header.append(headerAvatarContainer)
  _header.append(headerInfo)
  _header.append(headerExit)
  // tao hide/show cho mot tin nhan trong chatContainer
  _header.onclick = () => {
    let main = mes.children[1].style
    let status = main.display
    main.display = (status == 'none') ? 'block' : 'none'
  }

  let _body = newElement('DIV')
  // tao vai tin nhan gia
  let _mainMes = newElement('DIV', 'main-mess')
  _mainMes.append(addMes('his', 'Hi duy', 'Duydn', './img/duydn.png'))
  // _mainMes.append(addMes('my', 'hi hihi !'))
  // tao footer
  let _footer = newElement('DIV', 'footer')
  let _input = newElement('INPUT', 'input')
  _input.setAttribute('type', 'text')
  _input.setAttribute('placeholder', 'Type a message ...')
  _input.onkeydown = function (event) {
    if (event.key == 'Enter') {
      document.querySelectorAll('[roomid]').forEach(room => {
        console.log(room.getAttribute('roomid'))
        if (room.getAttribute('roomid') == roomid) {
          room.children[1].children[0].append(addMes('my', this.value))
          this.value = ''
        }
      })
    }
  }

  let _toolContainer = newElement('DIV', 'tool-container')
  let _icon = newElement('I', 'fas fa-check-square')
  _toolContainer.append(_icon)
  // hoan thien phan footer va body
  _footer.append(_input)
  _footer.append(_toolContainer)
  _body.append(_mainMes)
  _body.append(_footer)
  // mes hoan chinh
  mes.append(_header)
  mes.append(_body)
  
  // add action
  return mes
}

function addMes(type = 'my', context = '', name = '', src = '') {
  if (type == 'my') {
    let __myMessage = newElement('DIV', 'my-message')
    let __content = newElement('DIV', 'content')
    let __mes = newElement('SPAN', 'mes', context)
    __content.append(__mes)
    __myMessage.append(__content)
    return __myMessage
  } else {
    let _message = newElement('DIV', 'message')
    let _avatarContainer = newElement('DIV', 'avatar-container')
    let _avatar = newElement('IMG', 'avatar')
    _avatar.src = src
    _avatarContainer.append(_avatar)
    let _content = newElement('DIV', 'content')
    let _name = newElement('DIV', 'name', name)
    let _mes = newElement('DIV', 'mes', context)
    _content.append(_name)
    _content.append(_mes)
    _message.append(_avatarContainer)
    _message.append(_content)
    return _message
  }
}

const room = {
  room1: {
    user1: {
      name: 'user1',
      messages: ['hi', 'hello', 'Nice to meet you', 'bye']
    }

  }
}
const user = {
  abcd1234: {
    name: 'Duydn',
    age: 18,
    sex: 'male'
  }
}

_room.forEach(room => {
  console.log(room.children[0].children[2])
  room.children[0].children[2].onclick = () => {
    chatContainer.removeChild(room)
  }
  room.children[0].onclick = () => {
    let main = room.children[1].style
    let status = main.display
    main.display = (status == 'none') ? 'block' : 'none'
  }
})

let logOut = menu.lastElementChild

logOut.onclick = () => {
  firebase.auth().signOut();
  window.location = './mainpage'
  console.log('ok')
}

function showCard(src, name, quote) {
	let avatarContainer = newElement('DIV', 'avatar-container')
  	let avatar = newElement('IMG', 'avatar')
  	avatar.src = src
  	avatarContainer.append(avatar)

  	let infoContainer = newElement('DIV', 'info-container')
	let _name = newElement('P', 'name', name)
	let _quote = newElement('Q', 'quote', quote)
	infoContainer.append(_name)
	infoContainer.append(_quote)

	let toolbarContainer = newElement('DIV', 'toolbar')
	let _user = newElement('DIV', 'user-container')
	let _mes = newElement('DIV', 'mes-container')
	let _req = newElement('DIV', 'req-container')
	let usericon = newElement('I', 'far fa-user-circle')
	let mesicon = newElement('I', 'fas fa-comment-dots')
	let reqicon = newElement('I', 'fas fa-check-square')
	_user.append(usericon)
	_mes.append(mesicon)
	_req.append(reqicon)
	toolbarContainer.append(_user)
	toolbarContainer.append(_mes)
	toolbarContainer.append(_req)

	let card = newElement('DIV', 'card')
	card.append(avatarContainer)
 	card.append(infoContainer)
 	//let box = document.getElementsByClassName('card-container')[0]
   //console.log(box)
  console.log(card)
  cardContainer.append(card)
  cardContainer.append(toolbarContainer)
  console.log(cardContainer)
  console.log(toolbarCard)
  toolbarCard.append(toolbarContainer)
}

showCard('./img/duydn.png', 'ngoc', '112331423')
showCard('./img/duydn.png', 'ngocdm', '12123123')
console.log(toolbarCard)
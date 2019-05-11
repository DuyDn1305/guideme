// let messageButton = document.getElementById('mes-btn');
// let chatContainer = document.getElementById('chat-container')
let header = document.getElementsByClassName('header')[0]
let menu = header.children[1]
let mesBtn = menu.children[0]
let notiBtn = menu.children[1]

// console.log(notiBtn)

let mesBtnOn = 0
mesBtn.onclick = function () {
  if (mesBtnOn) {
    turnOff('mes-box')
  } else {
    turnOff('noti-box')
    turnOn('mes-box')
    showMes('./img/duydn.png', 'DuyDn', 'See you at 9.00 AM')
    showMes('./img/duydn.png', 'nghanhVu', 'See you at 9.00 AM')
    showMes('./img/duydn.png', 'ngoc', 'See you at 9.00 AM')
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

function showMes (src, name, message) {
  
  let avatarContainer = newElement('DIV', 'avatar-container')
  let avatar = newElement('IMG', 'avatar')
  avatar.src = src
  avatarContainer.appendChild(avatar)
  
  let infoContainer = newElement('DIV', 'info-container')
  let _name = newElement('P', 'name', name)
  let _mes = newElement('P', 'mes', message)
  infoContainer.appendChild(_name)
  infoContainer.appendChild(_mes)

  let _time = newElement('P', 'time', '9:00')

  let mes = newElement('DIV', 'mes-container')
  mes.appendChild(avatarContainer)
  mes.appendChild(infoContainer)
  mes.appendChild(_time)

  let box = document.getElementsByClassName('mes-box')[0]
  box.appendChild(mes)
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


let chatContainer = document.body.getElementsByClassName('chat-container')[0]
let _room = document.querySelectorAll('[roomid]')
console.log(chatContainer)

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

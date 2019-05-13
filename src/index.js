console.log('index.js loaded')
let header = document.getElementsByClassName('header')[0]
let menu = header.children[1]
let mesBtn = menu.children[0]
let notiBtn = menu.children[1]
// let messageButton = document.getElementById('mes-btn');
// let chatContainer = document.getElementById('chat-container')
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
let containerSearch = document.body.children[1].children[2].children[1]
let cardContainer = containerSearch.children[0]
let toolbarCard
let logOut = menu.lastElementChild

function newElement (type, classname = '', context = '') {
  let newEle = document.createElement(type)
  newEle.setAttribute('class', classname)
  newEle.innerHTML = context
  return newEle
}

// log out button
loadScript('./src/card.js')
loadScript('./src/chat.js')
loadScript('./src/googleapi.js')
loadScript('./src/logOut.js')
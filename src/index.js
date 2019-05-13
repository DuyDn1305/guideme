console.log('index.js loaded')
let header = document.getElementsByClassName('header')[0]
let menu = header.children[1]
let mesBtn = menu.children[0]
let notiBtn = menu.children[1]
// let messageButton = document.getElementById('mes-btn');
// let chatContainer = document.getElementById('chat-container')
let chatContainer = document.body.getElementsByClassName('chat-container')[0]
let _room = document.querySelectorAll('[roomid]')
let mesOnMesBox = []
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
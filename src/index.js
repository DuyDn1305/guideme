let header = document.getElementsByClassName('header')[0]
let menu = header.children[1]
// messager button
let mesBtn = menu.children[0]
// noti button
let notiBtn = menu.children[1]
// chat container including 2 chat
let chatContainer = document.body.getElementsByClassName('chat-container')[0]
// chat
let _room = document.querySelectorAll('[roomid]')
let mesOnMesBox = []
// right pane
let containerSearch = document.body.children[1].children[2].children[1]
let cardContainer = containerSearch.children[0]
// mes click (card)
let toolbarCard
let logOut = menu.lastElementChild
//left pane
let profilePane = document.getElementsByClassName('profile')[0]
console.log(profilePane)

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
console.log('index.js loaded')
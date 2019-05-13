console.log('card.js loaded')
function showCard(src, name, quote, roomid) {
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
  
  _mes.onclick = () => {
    let _src = './img/duydn.png'
    let _name = name
    let _mes = ''
    let _roomid = roomid
    
    if (checkValid(roomid, mesOnMesBox)) mesOnMesBox.push({
      src: _src,
      name: _name,
      mes: _mes,
      roomid: roomid
    })
    // close mesBox
    turnOff('mes-box')
    //remove if over 2 child
    if (!roomIsOnChat(roomid)) {
      if (chatContainer.childElementCount >= 2) chatContainer.removeChild(chatContainer.children[0])
      chatContainer.append(mesToChatContainer(_roomid, null, null, _name))
      _room = chatContainer.children
      mesToChatContainer(_roomid, null, null, _name)
    }
  }

function checkValid(e, arr) {
  //console.log(typeof(arr))
  ok = 1;
  //console.log(e)
  for (let k in arr) {
    //console.log(arr[k].roomid)
    //console.log()
    if (arr[k].roomid == e) {
      ok = 0;
      break;
    }
  }
  return ok
}

function roomIsOnChat(e) {
  let find = document.querySelector('[roomid~='+e+']')
  console.log(find)
  return find != null
}

	let card = newElement('DIV', 'card')
	card.append(avatarContainer)
  card.append(infoContainer)
  cardContainer.append(card)
  cardContainer.append(toolbarContainer)

  toolbarCard = document.querySelectorAll('[class~=toolbar]')
}

showCard('./img/duydn.png', 'ngoc', 'adsf', 'room1')
console.log(toolbarCard)
showCard('./img/duydn.png', 'ngocdm', '12123123', 'room2')

showCard('./img/duydn.png', 'ngocdmdmdm', '12123123', 'room3')


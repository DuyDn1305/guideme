function roomIsOnChat(e) {
  return $(`[roomId~='${e}']`).length != 0
}

function mesToChatContainer(roomId = '', messages, target) {
  // tao chat trong chat-container
  let mes = newElement('DIV', 'chat')
  mes.setAttribute('roomId', roomId)
  // tao header
  let _header = newElement('DIV', 'header')
  // tao hinh
  let headerAvatarContainer = newElement('DIV', 'avatar-container')
  let headerAvatar = newElement('IMG', 'avatar')
  headerAvatar.src = './img/duydn.png'
  headerAvatarContainer.append(headerAvatar)
  // tao info
  let headerInfo = newElement('DIV', 'info')
  let headerName = newElement('P', 'name', target.displayName)
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
  // body chat
  let _mainMes = newElement('DIV', 'main-mess')
  _mainMes.setAttribute('chatroomId', roomId)
  _body.append(_mainMes)
  
  // tao footer
  let _footer = newElement('DIV', 'footer')
  let _input = newElement('INPUT', 'input')
  _input.setAttribute('type', 'text')
  _input.setAttribute('placeholder', 'Type a message ...')
  _input.onkeydown = function (event) {
    if (event.key == 'Enter') {
      if (this.value != '') {
        chat.sendMessage(roomId, this.value, mid => {
          this.value = ''
          chat.setReadCursor(roomId, parseInt(mid));      
        })
      }
    }
  }
  _input.onfocus = e => {
    let mid = $(`[chatroomid='${roomId}']`).find('[mid]').last().attr('mid');
    chat.setReadCursor(roomId, parseInt(mid));
  }

  let _toolContainer = newElement('DIV', 'tool-container')
  let _icon = newElement('I', 'fas fa-check-square')
  _toolContainer.append(_icon)
  // hoan thien phan footer va body
  _footer.append(_input)
  _footer.append(_toolContainer)
  _body.append(_footer)
  // mes hoan chinh
  mes.append(_header)
  mes.append(_body)
  
  // add action
  if (!roomIsOnChat(roomId)) {
    if (chatContainer.childElementCount >= 2) chatContainer.removeChild(chatContainer.children[0])
    chatContainer.append(mes)
  }

  let cursor = chat.getReadCursor(roomId, target.uid);
  messages.forEach(mes => {
    if (cursor && mes.id == cursor.position) addMes(mes.sender.id == user.uid, getMsg(mes), target.displayName, target.photoURL, roomId, mes.id, [target.uid])
    else addMes(mes.sender.id == user.uid, getMsg(mes), target.displayName, target.photoURL, roomId, mes.id)
  })
}

function getRoom (targetID, cb) {
  WebChat.existRoom(user.uid, targetID, roomId => {
    if (roomId != '0') chat.getMessages(roomId, null, 50, m => cb(roomId, m));
    else {
      chat.createRoom({addUserIds: [`${targetID}`]}, room => {
        WebChat.markRoom(user.uid, targetID, room.id);
        cb(room.id, []);
      })
    }
  })
}

function guideme_chat(flag) {
	if (flag) return;

	chat.on('Message', (roomId, msg) => {
		let sender = userList[msg.sender.id]
		if (!roomIsOnChat(roomId)) {
			chat.getMessages(roomId, null, 50, m => {
				mesToChatContainer(roomId, m, sender);
				addMes(msg.sender.id == user.uid, getMsg(msg), sender.displayName, sender.photoURL, roomId, msg.id)
			})
		} else {
			addMes(msg.sender.id == user.uid, getMsg(msg), sender.displayName, sender.photoURL, roomId, msg.id)
		}
	})

  chat.on('NewReadCursor', (roomId, cursor) => {
    addSeen(cursor.user.id, roomId, cursor.position);
  })

  let mesBox = document.getElementsByClassName('mes-box')[0];
  let notiBox = document.getElementsByClassName('noti-box')[0];

  messageContainer.onclick = function () {
    notiBox.style.display = 'none';
    if (mesBox.style.display == 'none') mesBox.style.display = 'block';
    else mesBox.style.display = 'none';
  }

  notiContainer.onclick = function () {
    mesBox.style.display = 'none';
    if (notiBox.style.display == 'none') notiBox.style.display = 'block';
    else notiBox.style.display = 'none';
  }

  window.addEventListener('click', event => {
    if (event.target != messageContainer.children[0] && event.target != mesBox && mesBox.style.display != 'none') mesBox.style.display = 'none';
    if (event.target != notiContainer.children[0] && event.target != notiBox && notiBox.style.display != 'none') notiBox.style.display = 'none';
  })

  showMes = (src, name, message, roomId) => {
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
      chatContainer.append(mesToChatContainer(roomId, null, null, name))
      _room = chatContainer.children
    }

    // hien mes len Mesager thong bao
    let box = document.getElementsByClassName('mes-box')[0]
    box.appendChild(mes)
  }

  addMes = (my, context = '', tname = '', src = '', roomId, mid, ids = []) => {
    let mainMess = $(`[chatroomId='${roomId}'`)
    // add seen
    let seen = newElement('DIV', 'seen')
      seen.setAttribute('mid', mid)
    // avatar
    ids.forEach(id => {
      let avt = newElement('IMG', 'avatar')
      avt.src = list.data[id].photoURL
      avt.setAttribute('id', id)
      seen.append(avt);
    })
    
    if (my) {
      let myMessage = newElement('DIV', 'my-message')
      let content = newElement('DIV', 'content')
      let mes = newElement('SPAN', 'mes', context)
      content.append(mes)
      myMessage.append(content)
      // add seen
      myMessage.append(seen)
      mainMess.append(myMessage)
    } else {
      let message = newElement('DIV', 'message')
      let mesContent = newElement('DIV', 'mesContent')
      let avatarContainer = newElement('DIV', 'avatar-container')
      let avatar = newElement('IMG', 'avatar')
      avatar.src = src
      avatarContainer.append(avatar)
      let content = newElement('DIV', 'content')
      let name = newElement('DIV', 'name', tname)
      let mes = newElement('DIV', 'mes', context)
      content.append(name)
      content.append(mes)
      mesContent.append(avatarContainer)
      mesContent.append(content)
      // add seen
      message.append(mesContent)
      message.append(seen)
      mainMess.append(message)
    }
  }

  removeSeen = (roomId, userId) => {
    $room = $(`[chatroomid='${roomId}']`).find(`[id=${userId}]`).fadeOut(100, () => $(this).remove());
  }
  addSeen = (userId, roomId, mid) => {
    removeSeen(roomId, userId)
    let avt = newElement('IMG', 'avatar')
    avt.src = list.data[userId].photoURL
    avt.setAttribute('id', userId)
    let lastMsg = $(`[mid='${mid}']`)
    lastMsg.append(avt);
  }

  incProBar();
  console.log('chat.js loaded')
}
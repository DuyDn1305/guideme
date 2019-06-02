function roomIsOnChat(e) {
  return $(`[chatroomid~='${e}']`).length != 0
}

function mesToChatContainer(roomId, messages, target) {
  // tao chat trong chat-container
  let mes = newElement('DIV', 'chat')
  // tao header
  let _header = newElement('DIV', 'header')
  // tao hinh
  let headerAvatarContainer = newElement('DIV', 'avatar-container')
  let headerAvatar = newElement('IMG', 'avatar')
  headerAvatar.src = target.photoURL
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
    if (mid) chat.setReadCursor(roomId, parseInt(mid));
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
    if (chatContainer.childElementCount > 1) chatContainer.removeChild(chatContainer.children[0])
    chatContainer.append(mes)
  }

  let cursor = chat.getReadCursor(roomId, target.uid);
  messages.forEach(mes => {
    if (cursor && mes.id == cursor.position) addMes(mes.senderId == user.uid, getMsg(mes), mes.updatedAt, target.displayName, target.photoURL, roomId, mes.id, [target.uid])
    else addMes(mes.senderId == user.uid, getMsg(mes), mes.updatedAt, target.displayName, target.photoURL, roomId, mes.id)
  })

  _input.focus();
}

function getRoom (targetID, cb) {
  WebChat.existRoom(user.uid, targetID, roomId => {
    if (roomId != '0') chat.getMessages(roomId, null, 10, m => cb(roomId, m));
    else {
      chat.createRoom({addUserIds: [`${targetID}`]}, room => {
        WebChat.markRoom(user.uid, targetID, room.id);
        cb(room.id, []);
      })
    }
  })
}

function guideme_chat() {
	if (firstLoad) return;

	chat.on('Message', (roomId, msg) => {
    let sender = userList[msg.senderId]
		if (!roomIsOnChat(roomId)) {
			chat.getMessages(roomId, null, 50, m => {
				mesToChatContainer(roomId, m, sender);
        if (msg.senderId != user.uid) showMes(sender, getMsg(msg), msg.updatedAt, roomId);
			})
		} else {
      addMes(msg.senderId == user.uid, getMsg(msg), msg.updatedAt, sender.displayName, sender.photoURL, roomId, msg.id)
      if (msg.senderId != user.uid) showMes(sender, getMsg(msg), msg.updatedAt, roomId);
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

  showMes = (target, message, mesTime, roomId) => {
    $(`[mesid='${target.uid}']`).remove();
    let avatarContainer = newElement('DIV', 'avatar-container')
    let avatar = newElement('IMG', 'avatar')
    avatar.src = target.photoURL
    avatarContainer.append(avatar)
    // tao info
    let infoContainer = newElement('DIV', 'info-container')
    let _name = newElement('P', 'name', target.displayName)
    let _mes = newElement('P', 'mes', message)
    infoContainer.append(_name)
    infoContainer.append(_mes)
    // tao thoi gian
    let _time = newElement('P', 'time', getTimeFormat(new Date(mesTime), 0));
    // tao tin nhan
    let mes = newElement('DIV', 'mes-container')
    mes.setAttribute('mesid', target.uid);
    mes.append(avatarContainer)
    mes.append(infoContainer)
    mes.append(_time)
    // bam vao mes o tren thi o duoi hien len
    mes.onclick = () => {
      if (!roomIsOnChat(roomId)) {
        chat.getMessages(roomId, null, 50, m => {
          mesToChatContainer(roomId, m, target);
        })
      }
    }

    // hien mes len Mesager thong bao
    let box = document.getElementsByClassName('mes-box')[0]
    box.prepend(mes)
  }

  addMes = (me, context, mesTime, tname, src, roomId, mid, ids = []) => {
    let mainMess = $(`[chatroomid='${roomId}'`)
    // add seen
    let seen = newElement('DIV', 'seen')
      seen.setAttribute('mid', mid)
    // avatar
    ids.forEach(id => {
      let avt = newElement('IMG', 'avatar')
      avt.src = userList[id].photoURL
      avt.setAttribute('id', id)
      seen.append(avt);
    })
    
    if (me) {
      let myMessage = newElement('DIV', 'my-message')
      let content = newElement('DIV', 'content')
      let mes = newElement('SPAN', 'mes', context)
      mes.setAttribute('title', getTimeFormat(new Date()))
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
      let mes = newElement('div', 'mes', context)
      mes.setAttribute('title', getTimeFormat(new Date()))
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
    $(`[chatroomid='${roomId}']`).find(`[id='${userId}']`).fadeOut('fast', function() { this.remove(); });
  }

  addSeen = (userId, roomId, mid) => {
    removeSeen(roomId, userId, mid)
    let avt = newElement('IMG', 'avatar')
    avt.src = userList[userId].photoURL
    avt.setAttribute('id', userId)
    let lastMsg = $(`[mid='${mid}']`)
    lastMsg.append(avt);
  }

  console.log('chat.js loaded')
}
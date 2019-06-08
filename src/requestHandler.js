function guideme_request () {
  if (firstLoad) return;

  // type = [req, waiting, accepted, complete, cancel]
  window.renderReq = (target, type) => {
    if (user.moreinfo.type == 'visitor' && type =='req') type = 'waiting'
    // distingush
    let userAction = ''
    let expand = ''
    if (type == 'accepted' || type == 'complete' || type == 'cancel') expand = ' '+type;
    if (type == 'req') userAction = ' sent you a request'
    if (type == 'waiting') userAction = ' are responding your request'
    // add element
    let req = newElement("DIV", "item"+expand)
      let content = newElement("DIV", "content")
        let avatarContainer = newElement("DIV", "avatar-container")
          let avatar = newElement("IMG", "avatar")
          avatar.src = target.photoURL
        avatarContainer.append(avatar)
      content.append(avatarContainer)
        let info = newElement("DIV", "info")
          let name = newElement("SPAN", "name", target.displayName) 
        info.append(name)
        if (userAction) {
          let action = newElement("SPAN", 'action', userAction)
          info.append(action)
          if (type == 'waiting') {
            let dotLoad = newElement("SPAN", "dotload")
            for (let i = 0; i < 3; ++i) {
              let dot = newElement("SPAN", 'dot', '.')
              dotLoad.append(dot)
            }
            action.append(dotLoad)
          }
        }
      content.append(info)
    req.append(content)
    if (type != 'waiting') {
      let btn = newElement("DIV",  "btn"+expand)
        if (type == 'req') {
          btn.append(newElement("DIV", "btnAccept", "Accept"))
          btn.append(newElement("DIV", "btnDecline", "Decline"))
          btn.children[1].style.marginLeft = '4px'
        }
        if (type == 'accepted') btn.append(newElement("DIV", "btnAccept", "Trip started <i class='fas fa-walking'></i>"))
        if (type == 'complete') btn.append(newElement("DIV", "btnAccept", "Trip completed <i class='fas fa-check'></i>"))
        if (type == 'cancel') btn.append(newElement("DIV", "btnAccept", "Trip canceled <i class='far fa-frown-open'></i>"))
      req.append(btn)
    }
    reqBox.append(req)
    console.log('rendered '+type)      
  }

  window.waitingReq = (target= {displayName: 'USER', photoURL: './img/default.png'}) => {
    renderReq(target, 'waiting')
  }

  window.acceptedReq = (target= {displayName: 'USER', photoURL: './img/default.png'}) => {
    renderReq(target, 'accepted')
  }
  
  window.completeReq = (target = {displayName: 'USER', photoURL: './img/default.png'}) => {
    renderReq(target, 'complete')
  }

  window.cancelReq = (target = {displayName: 'USER', photoURL: './img/default.png'}) => {
    renderReq(target, 'cancel')
  }

  window.sendingRequest = (req) => {
    let sender = {displayName: user.displayName, photoURL: user.photoURL}
    let receiver = {displayName: userList[req.receiver].displayName, photoURL: userList[req.receiver].photoURL}
    if (req.type == 'req') {
      // update for user on Firebase
      let postData = {
        type: req.type,
        time: req.time,
        target: req.receiver
      }
      let reqId = 1
      if (reqList) reqId = String(Object.keys(reqList).length+1)
      db.ref('request/' + user.uid+ '/' + reqId).update(postData);
      reqHandler.send(req, user.uid)
    }

  }

  // receive-data function
  reqHandler.on('Request', req => { 
    if (req.data.receiver == user.uid) {
      let sender = {displayName: userList[req.sender].displayName, photoURL: userList[req.sender].photoURL}
      let data = req.data;
      // update for user
      let postData = {
        type: data.type,
        time: data.time,
        target: req.sender
      }
      let reqId = 1
      if (reqList) reqId = String(Object.keys(reqList).length+1)
      db.ref('request/' + user.uid+ '/' + reqId).update(postData);
      addNoti(sender, data.type, null, null, data.time)
      addPopup(sender, 'sent you a request')
    }
  })



  incProBar()
  console.log('request.js loaded')
}
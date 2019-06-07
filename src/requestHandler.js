function guideme_request () {
  if (firstLoad) return;

  function renderReq(target, type) {
    // distingush
    let userAction = ''
    let expand = ''
    if (type == 'accepted' || type == 'complete' || type == 'cancel') expand = ' '+type;
    if (type == 'sent') userAction = ' sent you a request'
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
        if (type == 'sent') {
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

  window.sentReq = (target = {displayName: 'USER', photoURL: './img/default.png'}) => {
    renderReq(target, 'sent')
    addPopup(target, 'sent you a request')
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

  incProBar()
  console.log('request.js loaded')
}
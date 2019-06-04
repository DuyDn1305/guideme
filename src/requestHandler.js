function guideme_request () {
  if (firstLoad) return;

  window.showReq = (sender, data) => {
    let req = newElement("DIV", "item")
      // avatar
      let avatarContainer = newElement("DIV", "avatar-container")
        let avatar = newElement("IMG", "avatar")
        avatar.src = sender.photoURL
      avatarContainer.append(avatar)
    req.append(avatarContainer)
      // content
      let content = newElement("DIV", "content")
        // info
        let info = newElement("DIV", "info")
          let name = newElement("SPAN", "name", 'user'+" ")
          let action = newElement("SPAN", "action", "Guide request!")
        info.append(name)
        info.append(action) 
        // btn
        let btn = newElement("DIV", "btn")
          let acceptBtn = newElement("DIV", "btnAccept", "Accept")
          let declineBtn = newElement("DIV", "btnDecline", "Decline")
        btn.append(acceptBtn)
        btn.append(declineBtn)
      content.append(info)
      content.append(btn)
    req.append(content)
    reqBox.append(req)
  }

  incProBar()
  console.log('request.js loaded')
}
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
      let name = newElement("SPAN", "name", 'user'+" ")
      let action = newElement("SPAN", "action", data)
      content.append(name)
      content.append(action)
      req.append(content)
    //option
    let option = newElement("DIV", 'option')
      let i = newElement("I", "fas fa-ellipsis-h btn")
      option.append(i)
    req.append(option)
    reqBox.append(req)
  }

  incProBar()
  console.log('request.js loaded')
}
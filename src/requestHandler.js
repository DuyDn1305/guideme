function guideme_request () {
  if (firstload) return;

  window.showReq = (sender, data) => {
    let req = newElement("DIV", "item")
    // avatar
    let avatarContainer = newElement("DIV", "avatar-container")
      let avatar = newElement("IMG", "./img/default.png")
    req.append(avatarContainer.append(avatar))
    // content
    let content = newElement("DIV", "content")
      let name = newElement("SPAN", "name", 'user')
      let action = newElement("SPAN", "action", data)
    req.append(content.append(name).append(action))
    //option
    let option = newElement("DIV", 'option')
      let i = newElement("I", "fas fa-ellipsis-h btn")
    req.append(option.append(i))
    reqBox.append(req)
  }

  incProBar();
  console.log('request.js loaded')
}
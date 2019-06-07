function guideme_popupHandler () {
  if (firstLoad) return;

  window.addPopup = (target = {displayName: 'USER', photoURL: './img/default.png'}, userAction) => {
    let popup = newElement("DIV", 'popup')
      let avatarContainer = newElement("DIV", "avatar-container")
        let avatar = newElement("IMG", "avatar")
        avatar.src = target.photoURL
      avatarContainer.append(avatar)
    popup.append(avatarContainer)
      let info = newElement("DIV", 'info')
        let name = newElement("SPAN", 'name', target.displayName)
      info.append(name)
        let action = newElement("DIV", 'action', userAction)
      info.append(action)
    popup.append(info)
    popup.style.display = 'none'
    popupContainer.append(popup)
    // add action
    $(popup).fadeIn(200)
    setTimeout(() => {
      $(popup).fadeOut(2500)
      $(popup).mouseenter(function () {$(popup).stop().fadeIn(1)})
      $(popup).mouseleave(function () {$(popup).fadeOut(2500)})
    }, 2000);
  }

  incProBar()
  console.log('popupHandler.js loaded')
}
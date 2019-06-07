function guideme_notiHandler () {
  if (firstLoad) return;
  // type = [comment, req, start, reject, complete]
  // numStar = [0, 1, 2, 3, 4, 5]
  window.addNoti = function (target = {displayName: 'USER', photoURL: './img/default.png'}, type, numStar = 0, comment = 'What a nice trip! I love it', timeSent ='30/04/1975') {
    let item
    if (type == 'comment') item = newElement("DIV", "item comment")
    else item = newElement("DIV", "item")
      let content = newElement("DIV", 'content')
        let avatarContainer = newElement("DIV", "avatar-container")
          let avatar = newElement("IMG", "avatar")
          avatar.src = target.photoURL
        avatarContainer.append(avatar)
      content.append(avatarContainer)
        let info = newElement("DIV", "info")
          let name = newElement("SPAN", "name", target.displayName)
        info.append(name)
          if (numStar) {
            let rate = newElement("SPAN", "rate")
            while (numStar--) {
              let star = newElement("I", "fas fa-star")
              rate.append(star)
            }
            info.append(rate)
              let action = newElement("P", "action"," "+comment)
            info.append(action)
          }
          else {
            let action = newElement("SPAN")
            if (type == 'req') action.innerHTML = ' sent you a request'
            if (type == 'start') action.innerHTML = ' your trip has been started, enjoy it !'
            if (type == 'reject') action.innerHTML = ' canceled your request'
            if (type == 'complete') action.innerHTML = ' and you have just completed the trip !'
            info.append(action)
          }
          let footer = newElement("DIV", "footer")
            let icon = newElement("SPAN", "icon "+type)
              let i
              if (type == 'comment') i = newElement("I", "fas fa-comment-alt")
              else i = newElement("I", "fas fa-paper-plane")
              i.style.marginRight = "2px"
            icon.append(i)
          footer.append(icon)
            let time = newElement("SPAN", "time", timeSent)
          footer.append(time)
        info.append(footer)
      content.append(info)
    item.append(content)
    notiBox.append(item)
    console.log('add noti')
  }

  incProBar()
  console.log('notiHandler.js loaded')
}
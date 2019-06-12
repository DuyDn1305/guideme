function guideme_notiHandler () {
  if (firstLoad) return;
  // type = [req, start, reject, complete]
  // numStar = [0, 1, 2, 3, 4, 5]
    window.addNoti = function (target = {displayName: 'USER', photoURL: './img/default.png'}, type, timeSent ='30/04/1975') {
        let item = newElement("DIV", "item")
            let content = newElement("DIV", 'content')
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName)
                info.append(name)
                    let action = newElement("SPAN")
                    if (type == 'req') action.innerHTML = ' sent you a request'
                    if (type == 'start') action.innerHTML = ' your trip has been started, enjoy it !'
                    if (type == 'reject') action.innerHTML = ' reject the trip'
                    if (type == 'complete') action.innerHTML = ' and you have just completed the trip !'
                info.append(action)
                    let footer = newElement("DIV", "footer")
                        let icon = newElement("SPAN", "icon "+type)
                            let i = newElement("I", "fas fa-paper-plane")
                            i.style.marginRight = "2px"
                        icon.append(i)
                    footer.append(icon)
                        let time = newElement("SPAN", "time", timeSent)
                    footer.append(time)
                info.append(footer)
            content.append(info)
        item.append(content)
        notiBox.prepend(item)
    }

    window.notiComment = function (target, data) {
        let item = newElement("DIV", "item comment")
            let content = newElement("DIV", 'content')
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName)
                info.append(name)
                    let rate = newElement("SPAN", "rate")
                    while (data.rate--) {
                        let star = newElement("I", "fas fa-star")
                        rate.append(star)
                    }
                info.append(rate)
                    let action = newElement("P", "action"," "+data.comment)
                info.append(action)
                    let footer = newElement("DIV", "footer")
                        let icon = newElement("SPAN", "icon comment")
                            let i = newElement("I", "fas fa-comment-alt")
                            i.style.marginRight = "2px"
                        icon.append(i)
                    footer.append(icon)
                        let time = newElement("SPAN", "time", data.time)
                    footer.append(time)
                info.append(footer)
            content.append(info)
        item.append(content)
        notiBox.prepend(item)
        console.log('notice comment')
    }

    incProBar()
    console.log('notiHandler.js loaded')
}
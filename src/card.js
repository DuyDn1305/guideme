ready.push(flag => { chat.ready = () => {
  while (cardContainer.children[0] != null) cardContainer.children[0].remove()
  list.uid.forEach(k => {
    const user = list.data[k]
    showCard(user)
  })
  if (flag) return;
  function showCard(target) {
    let src = target.photoURL
    let name = target.displayName
    let quote = target.quote ? target.quote : 'Nice to meet you'
    
    let avatarContainer = newElement('DIV', 'avatar-container')
      let avatar = newElement('IMG', 'avatar')
      avatar.src = src
      avatar.setAttribute('style', 'background: #bdc3c7')
      avatarContainer.append(avatar)
  
      let infoContainer = newElement('DIV', 'info-container')
    let _name = newElement('P', 'name', name)
    let _quote = newElement('Q', 'quote', quote)
    infoContainer.append(_name)
    infoContainer.append(_quote)
  
    let toolbarContainer = newElement('DIV', 'toolbar')
    let _user = newElement('DIV', 'user-container')
    let _mes = newElement('DIV', 'mes-container')
    let _req = newElement('DIV', 'req-container')
    let usericon = newElement('I', 'far fa-user-circle')
    let mesicon = newElement('I', 'fas fa-comment-dots')
    let reqicon = newElement('I', 'fas fa-check-square')
    _user.append(usericon)
    _mes.append(mesicon)
    _req.append(reqicon)
    toolbarContainer.append(_user)
    toolbarContainer.append(_mes)
    toolbarContainer.append(_req)
    
    _mes.onclick = () => {
        getRoom(target.uid, (roomId, msg) => {
        // close mesBox
        turnOff('mes-box')
        //remove if over 2 child
        mesToChatContainer(roomId, msg, target)
        
      })
      let _src = './img/duydn.png'
      let _name = name
  
    }
    let card = newElement('DIV', 'card')
    card.append(avatarContainer)
    card.append(infoContainer)
    cardContainer.append(card)
    cardContainer.append(toolbarContainer)
    
    toolbarCard = document.querySelectorAll('[class~=toolbar]')
  }
  
  console.log('card.js loaded')
}})

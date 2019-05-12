function showCard(src, name, quote) {
	let avatarContainer = newElement('DIV', 'avatar-container')
  	let avatar = newElement('IMG', 'avatar')
  	avatar.src = src
  	avatarContainer.appendChild(avatar)

  	let infoContainer = newElement('DIV', 'info-container')
	let _name = newElement('P', 'name', name)
	let _quote = newElement('P', 'quote', quote)
	infoContainer.appendChild(_name)
	infoContainer.appendChild(_quote)

	let toolbarContainer = newElement('DIV', 'toolbar')
	let _user = newElement('DIV', 'user-container')
	let _mes = newElement('DIV', 'mes-container')
	let _req = newElement('DIV', 'req-container')
	let usericon = newElement('I', 'far fa-user-circle')
	let mesicon = newElement('I', 'fas fa-comment-dots')
	let reqicon = newElement('I', 'fas fa-check-square')
	_user.appendChild(usericon)
	_mes.appendChild(mesicon)
	_req.appendChild(reqicon)
	toolbarContainer.appendChild(_user)
	toolbarContainer.appendChild(_mes)
	toolbarContainer.appendChild(_req)

	let card = newElement('DIV', 'card')
	card.appendChild(avatarContainer)
 	card.appendChild(infoContainer)
 	let box = document.getElementsByClassName('card-container')[0]
 	//console.log(box)
 	box.appendChild(card)
 	box.appendChild(toolbarContainer)

}

showCard('./img/duydn.png', 'ngoc', '123')
showCard('./img/duydn.png', 'ngoc', '123')
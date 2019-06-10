function guideme_trip () {
	if (firstLoad) return
	
	let modal = $('.modal')[1]

	window.showTripAccepted = (list = [], data) => {
		modal.style.display = 'block'
		let header = modal.children[0].children[0]
			header.children[0].innerHTML = '#Trip'
		let main = modal.children[0].children[1]
			main.children[0].innerHTML = "Guide: "
			main.children[1].innerHTML = "Visitor: "
			let time = main.children[2]
			time.innerHTML = data.time
			list.forEach(uid => {
				if (userList[uid].moreinfo.type == 'guide') {
					main.children[0].innerHTML += ' '+userList[uid].displayName
				}
				else main.children[1].innerHTML += ' '+userList[uid].displayName
			})
			let commentForm = main.children[3]
			let rateForm = main.children[4]
			commentForm.style.display = 'none'
			rateForm.style.display = 'none'	
		let footer = modal.children[0].children[2]
			let btnEnd = footer.children[0]
			let btnConfirm = footer.children[1]
			let btnCancel = footer.children[2]
			let btnReturn = footer.children[3]
			btnReturn.style.display = 'none'
			btnConfirm.style.display = 'none'
			btnCancel.style.display = 'none'
			btnEnd.style.display = 'none'
			if (user.moreinfo.type == 'guide') {
				btnReturn.style.display = 'block'
				btnReturn.onclick = () => {
					modal.style.display = 'none'
				}
			}
			else {
				btnEnd.style.display = 'block'
				btnEnd.onclick = () => {
					btnConfirm.style.display = 'block'
					btnCancel.style.display = 'block'
					btnEnd.style.display = 'none'
					commentForm.style.display = 'block'
					rateForm.style.display = 'block'
				}
				btnCancel.onclick = () => {
					btnConfirm.style.display = 'none'
					btnCancel.style.display = 'none'
					btnEnd.style.display = 'block'
					commentForm.style.display = 'none'
					rateForm.style.display = 'none'
				}
				btnConfirm.onclick = () => {
					$(`[reqId='${data.key}']`).fadeOut('fast', function() { this.remove(); });
					completingRequest({type: 'completed', time: new Date(), receiver: data.target, key: data.key, comment: 'thank hihi', rate: 5})
					modal.style.display = 'none'
				}
			}
	}

	window.showTripCompleted = (list = [], data) => {
		modal.style.display = 'block'
		let header = modal.children[0].children[0]
			header.children[0].innerHTML = '#Trip'
		let main = modal.children[0].children[1]
			main.children[0].innerHTML = "Guide: "
			main.children[1].innerHTML = "Visitor: "
			let time = main.children[2]
			time.innerHTML = data.time
			list.forEach(uid => {
				if (userList[uid].moreinfo.type == 'guide') {
					main.children[0].innerHTML += ' '+userList[uid].displayName
				}
				else main.children[1].innerHTML += ' '+userList[uid].displayName
			})
			let commentForm = main.children[3]
			let rateForm = main.children[4]
			commentForm.style.display = 'none'
			rateForm.style.display = 'none'	
		let footer = modal.children[0].children[2]
			let btnEnd = footer.children[0]
			let btnConfirm = footer.children[1]
			let btnCancel = footer.children[2]
			let btnReturn = footer.children[3]
			btnReturn.style.display = 'none'
			btnConfirm.style.display = 'none'
			btnCancel.style.display = 'none'
			btnEnd.style.display = 'none'
			if (user.moreinfo.type == 'guide') {
				btnReturn.style.display = 'block'
				btnReturn.onclick = () => {
					modal.style.display = 'none'
				}
			}
			else {
				btnEnd.style.display = 'block'
				btnEnd.onclick = () => {
					btnConfirm.style.display = 'block'
					btnCancel.style.display = 'block'
					btnEnd.style.display = 'none'
					commentForm.style.display = 'block'
					rateForm.style.display = 'block'
				}
				btnCancel.onclick = () => {
					btnConfirm.style.display = 'none'
					btnCancel.style.display = 'none'
					btnEnd.style.display = 'block'
					commentForm.style.display = 'none'
					rateForm.style.display = 'none'
				}
				btnConfirm.onclick = () => {
					$(`[reqId='${data.key}']`).fadeOut('fast', function() { this.remove(); });
					completingRequest({type: 'completed', time: new Date(), receiver: data.target, key: data.key, comment: 'thank hihi', rate: 5})
					modal.style.display = 'none'
				}
			}
	}

	window.addEventListener('click', event => {
		if (event.target == modal) {
			modal.style.display = 'none'
		}
	})

	incProBar()
	console.log('trip.js loaded')
}
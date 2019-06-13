function guideme_trip () {
	if (firstLoad) return
	
	let modal = $('.mymodal')[1]

	window.showTripAccepted = (list = [], data) => {
		$(modal).fadeIn()
		let header = modal.children[0].children[0] // title
			header.children[0].innerHTML = '#Trip'
		let main = modal.children[0].children[1] // main
			$(main).css('display', 'block')
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
		let feedback = modal.children[0].children[2] //comment+rate
			feedback.style.display = 'none'
			let form = $('#comment-form')[0];
			
		let footer = modal.children[0].children[3] // button
			let btnEnd = footer.children[0]
			let btnConfirm = footer.children[1]
			let btnCancel = footer.children[2]
			let btnReturn = footer.children[3]
			$(btnReturn).css('display', 'none')
			$(btnCancel).css('display', 'none')
			$(btnConfirm).css('display', 'none')
			$(btnEnd).css('display', 'none')
			if (user.moreinfo.type == 'guide') {
				$(btnReturn).fadeIn()
				btnReturn.onclick = () => {
					$(modal).fadeOut()
				}
			}
			else {
				$(btnEnd).fadeIn()
				btnEnd.onclick = () => {
					$(btnCancel).fadeIn()
					$(btnConfirm).fadeIn()
					$(btnEnd).fadeOut()
					$(feedback).fadeIn()
					$(main).fadeOut()
				}
				btnCancel.onclick = () => {
					$(btnCancel).fadeOut()
					$(btnConfirm).fadeOut()
					$(btnEnd).fadeIn()
					$(feedback).fadeOut()
					$(main).fadeIn()
				}

				let disable = 0
				btnConfirm.onclick = () => {
					if (disable) return
					setTimeout(() => {
						disable = 0
					}, 1000);
					disable = 1
					if (form.checkValidity()) {
						let starId = $(form).find("input:checked").attr("id")
						if (!starId) {
							let stars = $(form).find("label")
							for (let k = 0; k < 5; ++k) {
								setTimeout(() => {
									$(stars[k]).effect("bounce", "fast")
								}, 250-k*50);	
							}
						}
						else {
							$(`[reqId='${data.key}']`).fadeOut('fast', function() { this.remove(); });
							completingRequest({type: 'completed', time: new Date(), receiver: data.target, key: data.key, comment: $(form).find("[placeholder='Nhận xét']").val(), rate: Number(6-starId[4])})
							$(modal).fadeOut()
						}
					} else {
						form.reportValidity();
					}
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
			$(modal).fadeOut()
		}
	})

	incProBar()
	console.log('trip.js loaded')
}
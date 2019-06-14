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
			time.innerHTML = "Thời gian: "+getTimeFormat(new Date(data.time))
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
									$(stars[k]).css("animation", "wobble 0.8s ease-out")
								}, 500-k*100);	
								setTimeout(() => {
									$(stars[k]).css("animation", "none")
								}, 900);
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
		console.log(data.key)
		$(modal).fadeIn()
		let header = modal.children[0].children[0] // title
			header.children[0].innerHTML = '#Trip'
		let main = modal.children[0].children[1] // main
			$(main).css('display', 'block')
			main.children[0].innerHTML = "Guide: "
			main.children[1].innerHTML = "Visitor: "
			let time = main.children[2]
			time.innerHTML = "Thời gian: "+getTimeFormat(new Date(data.time))
			list.forEach(uid => {
				if (userList[uid].moreinfo.type == 'guide') {
					main.children[0].innerHTML += ' '+userList[uid].displayName
				}
				else main.children[1].innerHTML += ' '+userList[uid].displayName
			})
			main.children[3].innerHTML = "Nhận xét: "+data.comment
			main.children[4].innerHTML = "Số sao bình chọn: "
			//for (let k = 1; k <= data.rate; ++k) 
			console.log(data.rate)
			for (let k = 1; k <= data.rate; ++k) main.children[4].innerHTML += "<i class='fas fa-star' style='color: #f1c40f'></i>"
			let feedback = modal.children[0].children[2] //comment+rate
			feedback.style.display = 'none'
			

		let footer = modal.children[0].children[3] // button
			let btnEnd = footer.children[0]
			let btnConfirm = footer.children[1]
			let btnCancel = footer.children[2]
			let btnReturn = footer.children[3]
			$(btnReturn).css('display', 'none')
			$(btnCancel).css('display', 'none')
			$(btnConfirm).css('display', 'none')
			$(btnEnd).css('display', 'none')
			$(btnReturn).fadeIn()
			btnReturn.onclick = () => {
				$(modal).fadeOut()
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
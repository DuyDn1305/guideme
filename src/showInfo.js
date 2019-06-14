function getAvgStar(numStar, numCmt) {
	let avg = numStar/numCmt;
	let lo = Math.floor(avg);
	let val = avg - lo;
	if (val < 0.3) return [avg, lo, false];
	if (val > 0.8) return [avg, lo+1, false];
	return [avg, lo, true];
}

function getInfo(user, profile) {
	let avatar = profile.children[0].children[0]
		avatar.src = user.photoURL
	let about = profile.children[1] // about
		about.children[0].innerHTML = user.displayName // name
		about.children[2].children[0].innerHTML = user.quote || 'NICE TO MEET YOU' //quote
		if (userDataLog[user.uid] == undefined) {
			userDataLog[user.uid] = {load: 1, cmt: 0, stars: 0}
			if (user.moreinfo.type == 'guide') {
				console.log(userDataLog[user.uid].cmt + " "+ userDataLog[user.uid].stars)
				let inspect = about.children[3].children[2]
				// add comment
				if (user.moreinfo.type == 'guide') {
					console.log("loaded"+user.displayName)
					db.ref('request/'+user.uid).orderByChild("type").equalTo('completed').on('child_added', snap => {
						console.log('added from added_child')
						let data = snap.val()
						let target = userList[data.target]
						userDataLog[user.uid].stars += data.rate
						about.children[3].children[0].children[0].innerHTML = ++userDataLog[user.uid].cmt // comments
						about.children[3].children[1].children[0].innerHTML = userDataLog[user.uid].stars// stars
						about.children[3].style.display = 'flex' // show 
						let card = newElement("DIV", "card")
							let content = newElement("DIV", "content")
								let avatarContainer = newElement('DIV', 'avatar-container')
									let avatar = newElement('IMG', 'avatar')
										avatar.src = target.photoURL
								avatarContainer.append(avatar)
							content.append(avatarContainer)
								let info = newElement("DIV", "info")
									let name = newElement("SPAN", "name", target.displayName)
									let rate = newElement("SPAN", "rate")
										while (data.rate--) rate.append(newElement("I", "fas fa-star")) 
									let text = newElement("P", "text", data.comment)
									let time = newElement("DIV", "time", data.time)
								info.append(name)
								info.append(rate)
								info.append(text)
								info.append(time)
							content.append(info)
						card.append(content)
						inspect.append(card)
					})
				}
			}
		}
		if (!userDataLog[user.uid].cmt) about.children[3].style.display = 'none' // hide if no comment
		else  about.children[3].style.display = 'flex'
	let link = profile.children[2] // links
		let moreinfo = user.moreinfo
		let linkName = [moreinfo.fbName, moreinfo.twName, moreinfo.igName, user.displayName] 
		let	linkURL = [moreinfo.fbURL, moreinfo.twURL, moreinfo.igURL, user.email]
		linkName.forEach((value, k) => {
			if (value) {
				link.children[k].style.display = 'block'
				link.children[k].children[1].innerHTML = value
			}
			else link.children[k].style.display = 'none'
		})
		linkURL.forEach((value, k) => {
			if (value) {
				$(link.children[k].children[1]).attr('href', value).attr('target', '_blank').attr('data-original-title', value)
				link.children[k].children[2].style.display = 'none'
			}
			else link.children[k].children[2].style.display = 'inline-block'
		})
	let info = profile.children[3] // info
		let year = moreinfo.dob.slice(0, 4)
		let thisYear = new Date().getFullYear()
		data = [thisYear-year, moreinfo.cmnd, moreinfo.dob, moreinfo.workplace, moreinfo.telephone, moreinfo.type]
		data.forEach((e, k) => {
			if (e) info.children[k].children[1].innerHTML = e
			else info.children[k].style.display = 'none'
		})
	let typeBar = profile.children[4]
		if (user.isBusy != 0) {
			typeBar.style.display = 'block'
			typeBar.children[1].innerHTML = userList[user.isBusy].displayName
		}
		else typeBar.style.display = 'none'
}
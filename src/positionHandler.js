function guideme_positionHandler () {
	creatingScript(() => {
		getUserCurrentPosition(user.uid)
		let posRef = db.ref("position/")
		posRef.on("child_added", snap => {
			console.log(snap.val())
			if (userDataLog[snap.key] == undefined) initUserLog(snap.key)
			showPos(snap.val().geolocation, snap.key)	
		})
		posRef.on("child_changed", snap => {
			console.log(snap.val())
			showPos(snap.val().geolocation, snap.key)		
		})
		console.log("positionHandler.js loaded")	
		incProBar();
	})
}
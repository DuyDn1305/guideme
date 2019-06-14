function guideme_positionHandler () {
	if(firstLoad) return
	creatingScript(() => {
		getUserCurrentPosition(user.uid)
		let posRef = db.ref("position/")
		posRef.on("child_added", snap => {
			if (userDataLog[snap.key] == undefined) initUserLog(snap.key)
			showPos(snap.val().geolocation, snap.key)	
		})
		posRef.on("child_changed", snap => {
			showPos(snap.val().geolocation, snap.key)		
		})
		console.log("positionHandler.js loaded")	
		incProBar();
	})
}
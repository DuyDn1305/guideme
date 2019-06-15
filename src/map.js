function guideme_map() {
	if (firstLoad) return;
	function getUserCurrentPosition (id) {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(pos => {
				console.log(pos)
				let latLng = {lat: pos.coords.latitude, lng: pos.coords.longitude}
				if (map) map.setCenter(latLng);
				db.ref('position/'+id).update({geolocation: latLng})
			})
		}
		else {
			console.log('cannot get')
		}	
	}
		
	function handleLocationError(hasGEO, infoWindow, pos) {
		if (!infoWindow) {
			console.log('map not load')
			return
		}
		infoWindow.setPosition(pos);
		infoWindow.setContent(hasGEO ? 'Lỗi: không thể sử dụng GEOLOCATION.' : 'Lỗi: thiết bị này không hỗ trợ GEOLOCATION');
		infoWindow.open(map);
	}
	
	function creatingScript () {
		let script = document.createElement('script')
		db.ref("key").once("value", snap => {
			key = snap.val()
			script.src = "https://maps.googleapis.com/maps/api/js?key="+key+"&callback=initMap"
			document.body.append(script)
		})
	}
	creatingScript()
	
	window.initMap = () => {
		map = new google.maps.Map(xMap, {
			center: {lat: 10.035, lng: 105.775},
			zoom: 12,
			mapTypeControl: false
		});
		
        let styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);

        var styleSelector = document.getElementById('style-selector');
        map.setOptions({styles: styles[styleSelector.value]});

        styleSelector.addEventListener('change', function() {
          map.setOptions({styles: styles[styleSelector.value]});
        });
		infoWindow = new google.maps.InfoWindow
	
		function showPos (latLng, map, id, iconURL = '../img/undefined.png') {
			if (markers[id]) markers[id].setMap(null)
			var marker = new google.maps.Marker({
				position: latLng,
				map: map, 
				icon: {
				  url: iconURL, 
				  size: new google.maps.Size(48, 48),
				  origin: new google.maps.Point(0, 0),
				  anchor: new google.maps.Point(24, 24)
				}, 
				shape: {
				  coords: [20, 0, 20, 20, 0, 30, 0, 48, 48, 48, 48, 30, 28, 30, 28, 0],
				  type: 'poly'
				}
			  })
			markers[id] = marker
			markers[id].setMap(map);
			marker.addListener('click', e => {
				let modal = document.getElementById("myModal")
				let targetProfile = modal.children[0].children[1]
				getInfo(userList[id], targetProfile);
				modal.style.display = "block"
			})
		}
		// handle position
		getUserCurrentPosition(user.uid)
		let posRef = db.ref("position/")
		
		posRef.on("child_added", snap => {
			let key = snap.key;
			if (userDataLog[key] == undefined) initUserLog(key)
			let iconType
			if (userList[key].isBusy) iconType = "./img/busy.png"
			else iconType = (userList[key].moreinfo.type == "visitor") ? "./img/visitor.png" : "./img/guide.png"
			console.log(iconType+" "+userList[key].moreinfo.type)
			showPos(snap.val().geolocation, map, key, iconType)	
		})
		posRef.on("child_changed", snap => {
			let key = snap.key;
			let iconType
			if (userList[key].isBusy) iconType = "./img/busy.png"
			else iconType = (userList[key].moreinfo.type == "visitor") ? "./img/visitor.png" : "./img/guide.png"
			showPos(snap.val().geolocation, map, key, iconType)	
		})	
	}

	incProBar();
}
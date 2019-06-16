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
	creatingScript()
	window.initMap = () => {
		map = new google.maps.Map(xMap, {
			center: {lat: 10.035, lng: 105.775},
			zoom: 12,
			mapTypeControl: false
		});
		
		//var searchBox = new google.maps.places.SearchBox(input);
		let mapSelector = createMapSelector()
		let topPane = createTopPane()
		let indicatorIcon = createIndicatorIcon()
		map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(mapSelector)
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(topPane)
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(indicatorIcon)
		// mapselector
        map.setOptions({styles: styles[$(mapSelector).find("input[type='radio']:checked").val()]});
		$(mapSelector).change(() => {
			let val = $(mapSelector).find("input[type='radio']:checked").val()
			if (val == 'satellite') map.setMapTypeId('satellite')
          	else map.setOptions({styles: styles[val]});
		})

		infoWindow = new google.maps.InfoWindow
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

	function createMapSelector() {
		let div = newElement("DIV"); $(div).attr('id', 'map-type-select')
			let labeldefault = newElement("LABEL"); $(labeldefault).attr('for', 'default'); let imgdefault = newElement("IMG"); $(imgdefault).attr('src', "./img/mapdefault.png"); labeldefault.append(imgdefault)
			let inputdefault = newElement("INPUT"); $(inputdefault).attr({type: 'radio', name: 'maptype', value: 'default', id: 'default'})
		div.append(labeldefault); div.append(inputdefault);
			let labelsilver = newElement("LABEL"); $(labelsilver).attr('for', 'silver'); let imgsilver = newElement("IMG"); $(imgsilver).attr('src', "./img/mapsilver.png"); labelsilver.append(imgsilver)
			let inputsilver = newElement("INPUT"); $(inputsilver).attr({type: 'radio', name: 'maptype', value: 'silver', id: 'silver'})
		div.append(labelsilver); div.append(inputsilver);
			let labelretro = newElement("LABEL"); $(labelretro).attr('for', 'retro'); let imgretro = newElement("IMG"); $(imgretro).attr('src', "./img/mapretro.png"); labelretro.append(imgretro)
			let inputretro = newElement("INPUT"); $(inputretro).attr({type: 'radio', name: 'maptype', value: 'retro', id: 'retro'})
		div.append(labelretro); div.append(inputretro);
			let labelblue = newElement("LABEL"); $(labelblue).attr('for', 'blue'); let imgblue = newElement("IMG"); $(imgblue).attr('src', "./img/mapblue.png"); labelblue.append(imgblue)
			let inputblue = newElement("INPUT"); $(inputblue).attr({type: 'radio', name: 'maptype', value: 'blue', id: 'blue', checked: ''})
		div.append(labelblue); div.append(inputblue);
			let labelhiding = newElement("LABEL"); $(labelhiding).attr('for', 'hiding'); let imghiding = newElement("IMG"); $(imghiding).attr('src', "./img/maphiding.png"); labelhiding.append(imghiding)
			let inputhiding = newElement("INPUT"); $(inputhiding).attr({type: 'radio', name: 'maptype', value: 'hiding', id: 'hiding'})
		div.append(labelhiding); div.append(inputhiding);
			let labelnight = newElement("LABEL"); $(labelnight).attr('for', 'night'); let imgnight = newElement("IMG"); $(imgnight).attr('src', "./img/mapnight.png"); labelnight.append(imgnight)
			let inputnight = newElement("INPUT"); $(inputnight).attr({type: 'radio', name: 'maptype', value: 'night', id: 'night'})
		div.append(labelnight); div.append(inputnight);
			let labelhybrid = newElement("LABEL"); $(labelhybrid).attr('for', 'hybrid'); let imghybrid = newElement("IMG"); $(imghybrid).attr('src', "./img/maphybrid.png"); labelhybrid.append(imghybrid)
			let inputhybrid = newElement("INPUT"); $(inputhybrid).attr({type: 'radio', name: 'maptype', value: 'hybrid', id: 'hybrid'})
		div.append(labelhybrid); div.append(inputhybrid);
			let labelassasin = newElement("LABEL"); $(labelassasin).attr('for', 'assasin'); let imgassasin = newElement("IMG"); $(imgassasin).attr('src', "./img/mapassasin.png"); labelassasin.append(imgassasin)
			let inputassasin = newElement("INPUT"); $(inputassasin).attr({type: 'radio', name: 'maptype', value: 'assasin', id: 'assasin'})
		div.append(inputassasin); div.append(labelassasin); 
		return div
	}
	function createTopPane() {
		let div = newElement("DIV")
		$(div).attr('id', 'map-top-push')
			let input = newElement("INPUT", "form-control")
			$(input).attr({id: "map-input", type: "text", placeholder: "Tìm kiếm"})
			let selectStart = newElement("SELECT", "custom-select mr-sm-2"); $(selectStart).attr('id', "direction-start")
				let opt = newElement("OPTION"); $(opt).attr("selected", ""); opt.innerHTML = "start"
				let opt1 = newElement("OPTION"); $(opt1).attr("value", "1"); opt1.innerHTML = "one"
				let opt2 = newElement("OPTION"); $(opt2).attr("value", "2"); opt2.innerHTML = "two"
				let opt3 = newElement("OPTION"); $(opt3).attr("value", "3"); opt3.innerHTML = "three"
			selectStart.append(opt); selectStart.append(opt1); selectStart.append(opt2); selectStart.append(opt3)
			let selectEnd = newElement("SELECT", "custom-select mr-sm-2"); $(selectEnd).attr('id', "direction-end")
				opt = newElement("OPTION"); $(opt).attr("selected", ""); opt.innerHTML = 'end'
				opt1 = newElement("OPTION"); $(opt1).attr("value", "1"); opt1.innerHTML = "one"
				opt2 = newElement("OPTION"); $(opt2).attr("value", "2"); opt2.innerHTML = "two"
				opt3 = newElement("OPTION"); $(opt3).attr("value", "3"); opt3.innerHTML = "three"
			selectEnd.append(opt); selectEnd.append(opt1); selectEnd.append(opt2); selectEnd.append(opt3)
		div.append(input)
		div.append(selectStart)
		div.append(selectEnd)
		return div
	}
	function createIndicatorIcon() {
		let div = newElement("DIV", "btn btn-light")
		$(div).attr("id", "map-indicator")
			let img = newElement("IMG")
			$(img).attr("src", "./img/gps-fixed-indicator.png")
		div.append(img)
		return div
	}

	incProBar();
}
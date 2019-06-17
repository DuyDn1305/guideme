function guideme_map() {
	if (firstLoad) return;
	let watch, status = 0, indicatorIcon, searchBox, clearIcon, addMarkIcon, markerIconToggle = 0
	let markers_search = [], markers_appoint = [], markers_complete = [], del = []
	let startPlace, endPlace
	window.getUserCurrentPosition = (id) => {
		if (navigator.geolocation) {
			if (!status) {
				status = 1
				watch = navigator.geolocation.watchPosition(pos => {
					let latLng = {lat: pos.coords.latitude, lng: pos.coords.longitude}
					if (map) {
						map.setCenter(latLng);
						map.setZoom(12);
					}
					db.ref('position/'+id).update({geolocation: latLng})
				})
			}
			else {
				status = 0
				navigator.geolocation.clearWatch(watch) 
			} 
		}
		else {
			handleLocationError(false, infoWindow, map.getCenter())
		}	
	}
		
	function handleLocationError(hasGEO, infoWindow, pos) {
		if (!infoWindow) {
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
			script.src = "https://maps.googleapis.com/maps/api/js?key="+key+"&libraries=places&callback=initMap"
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
				coords: [0, 24, 24, 0, 48, 24, 24, 48],
			  	type: 'poly'
			}
		  })
		markers[id] = marker
		markers[id].setMap(map);
		marker.addListener('click', e => {
			let modal = document.getElementById("myModal")
			let targetProfile = modal.children[0].children[1]
			if (user.uid == id) {
				let tmp = profilePane.cloneNode(true)
				modal.children[0].children[1].remove()
				modal.children[0].append(tmp)
			}
			else getInfo(userList[id], targetProfile)
			$(modal).fadeIn()
		})
	}
	function getPoint(k) {
		if (k == user.uid || k == user.isBusy) return markers[k].position
		else return markers_complete[k].position
	}
	creatingScript()
	window.initMap = () => {
		map = new google.maps.Map(xMap, {
			center: {lat: 10.035, lng: 105.775},
			zoom: 12,
			mapTypeControl: false
		});
		let mapSelector = createMapSelector()
		let topPane = createTopPane()
		indicatorIcon = createIndicatorIcon()
		clearIcon = createClearIcon()
		addMarkIcon = createAddMarkIcon()
		//let rightPane = newElement("DIV"); rightPane.append(indicatorIcon); rightPane.append(clearIcon)
		let input = topPane.children[0]
		startPlace = topPane.children[1]
		endPlace = topPane.children[2]
		infoWindow = new google.maps.InfoWindow
		searchBox = new google.maps.places.SearchBox(input);
		let directionsService = new google.maps.DirectionsService();
		let directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
		map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(mapSelector)
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(topPane)
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(indicatorIcon)
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(clearIcon)
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(addMarkIcon)
		map.setOptions({styles: styles[$(mapSelector).find("input[type='radio']:checked").val()]});
		// select map type
		let onChangeHandler = function() {
			calculateAndDisplayRoute(directionsService, directionsDisplay);
		};
		directionsDisplay.setMap(map)
		startPlace.addEventListener('change', onChangeHandler);
		endPlace.addEventListener('change', onChangeHandler);
		function calculateAndDisplayRoute(directionsService, directionsDisplay) {
			let k1 = document.getElementById('direction-start').value
			let k2 = document.getElementById('direction-end').value
			if (k1 != 0 && k2 != 0) {
				let pointEnd, pointStart
				pointStart = getPoint(k1)
				pointEnd = getPoint(k2)
				directionsService.route({
					origin: pointStart,
					destination: pointEnd,
					travelMode: 'DRIVING'
				}, function(response, status) {
					if (status === 'OK') {
						directionsDisplay.setDirections(response);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				})
			}
		}
		$(mapSelector).change(() => {
			let val = $(mapSelector).find("input[type='radio']:checked").val()
			if (val == 'satellite') map.setMapTypeId('satellite')
		  	else map.setOptions({styles: styles[val]});
		})
		// define my location
		$(indicatorIcon).click(() => {
			getUserCurrentPosition(user.uid)
			if (status) $(indicatorIcon).css("background", "#bdc3c7")
			else $(indicatorIcon).css("background", "#f8f9fa")
		})
		$(addMarkIcon).click(function() {
			markerIconToggle = 1-markerIconToggle
			if (markerIconToggle) $(addMarkIcon).css('background', '#e2e6ea')
			else $(addMarkIcon).css('background', 'white')
		})
		map.addListener('bounds_changed', function() {
			searchBox.setBounds(map.getBounds());
		});
		// search
		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();
  
			if (places.length == 0) {
			  return;
			}
  
			// Clear out the old markers.
			markers_search.forEach(function(marker) {
			  marker.setMap(null);
			});
			markers_search = [];
			let bounds = new google.maps.LatLngBounds();
			places.forEach(function (place) {
				if (!place.geometry) {
					return;
				}
				let icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};
				markers_search.push(new google.maps.Marker({
					map: map,
					icon: icon,
					title: place.name,
					position: place.geometry.location
				}));
				if (place.geometry.viewport) {
					bounds.union(place.geometry.viewport);
				} else {
					bounds.extend(place.geometry.location);
				}
			});
			map.fitBounds(bounds);
		})
		// clear appoint
		$(clearIcon).click(() => {
			for (let k in markers_appoint) if (markers_appoint[k] && arrAppoint[k][user.uid]) markers_appoint[k].setMap(null)
			for (let k in markers_appoint) {
				if (markers_appoint[k] && arrAppoint[k][user.uid]) {
					markers_appoint[k].setMap(null)
					del[k] = 1
					db.ref("appoint/"+k).set({})
				} 
			}
			markers_appoint = []
		})
		// load data form firebase
		let posRef = db.ref("position/")
		posRef.on("child_added", snap => {
			snapHandler(snap)
		})
		posRef.on("child_changed", snap => {
			snapHandler(snap)
		})	
		function snapHandler(snap) {
			if (snap.val().geolocation == undefined) return
			let key = snap.key;
			let busy = snap.val().isBusy
			if (userDataLog[key] == undefined) initUserLog(key)
			if (key == user.uid && user.moreinfo.type == 'guide' && busy) showPos(snap.val().geolocation, map, key, "./img/myguide.png")
			if (key == user.uid && user.moreinfo.type == 'guide' && !busy) showPos(snap.val().geolocation, map, key, "./img/guide.png")
			if (key == user.uid && user.moreinfo.type == 'visitor') showPos(snap.val().geolocation, map, key, "./img/visitor.png")
			if (user.moreinfo.type == 'visitor') {
				if (user.uid == busy) showPos(snap.val().geolocation, map, key, "./img/myguide.png")
				else if (userList[key].moreinfo.type == 'guide') showPos(snap.val().geolocation, map, key, "./img/guide.png") 
			}
			if (user.moreinfo.type == 'guide') {
				if (userList[key].moreinfo.type == 'guide') showPos(snap.val().geolocation, map, key, "./img/guide.png")
				if (user.uid == busy) showPos(snap.val().geolocation, map, key, "./img/visitor.png")
			}
		}
		function addComplete(latLng, map, k) {
			if(markers_complete[k]) return
			else {
				let point = new google.maps.Marker({
					position: latLng,
					map: map,
					icon: {
						url: "./img/complete.png", 
						size: new google.maps.Size(48, 48),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(24, 24)
					}, 
					shape: {
						coords: [0, 24, 24, 0, 48, 24, 24, 48],
						type: 'poly'
					},
					label: String(Object.keys(markers_complete).length+1)
				})
				point.setMap(map)
				markers_complete[k] = point
				markers_complete[k].id = Object.keys(markers_complete).length
				point.addListener("click", e => {
					infoWindow.setPosition(latLng)
					infoWindow.setContent(createCompleteInfo("Điểm hẹn "+point.label, undefined, undefined, () => {
						infoWindow.close()
					}, () => {
						if (confirm("Bạn muốn xóa điểm hẹn này không ?")) {
							infoWindow.close()
							db.ref("appoint/"+k).set({})
							if (markers_complete[k]) {
								del[k] = 1
								markers_complete[k].setMap(null)
							}
							delete markers_complete[k]
						}
					}))
					infoWindow.open(map)
				})
			}
		}
		function addTemp(latLng, map, k, meClick) {
			if (del[k]) return
			let point
			if (!meClick) {
				point = new google.maps.Marker({
					position: latLng,
					map: map,
					icon: {
						url: "./img/tmp.png", 
						size: new google.maps.Size(48, 48),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(24, 24)
					}, 
					shape: {
						coords: [0, 24, 24, 0, 48, 24, 24, 48],
						type: 'poly'
					},
					label: String(Object.keys(markers_appoint).length+1)
				})
			}
			else {
				point = new google.maps.Marker({
					position: latLng,
					map: map
				})
			}
			point.setMap(map)
			markers_appoint[k] = point
			if (!meClick) {
				point.addListener('click', e => {
					if (del[k]) {
						infoWindow.setPosition(latLng);
						infoWindow.setContent('Điểm này đã bị xóa');
						infoWindow.open(map);
					}
					infoWindow.setPosition(latLng)
					infoWindow.setContent(createTempInfo("Điểm hẹn "+point.label, undefined, undefined, () => {
						if (confirm("Bạn chấp nhận điểm hẹn này không ?")) {
							infoWindow.close()
							db.ref("appoint/"+k).update({[user.uid]: 1})
							hideMark(markers_appoint)
							for (let k in markers_appoint) {
								if (markers_appoint[k]) markers_appoint[k].setMap(null)
								del[k] = 1
								db.ref("appoint/"+k).set({})
							}
							markers_appoint = []
						}
					}, () => {
						if (confirm("Bạn muốn xóa điểm hẹn này không ?")) {
							infoWindow.close()
							db.ref("appoint/"+k).set({})
							if (markers_appoint[k]) {
								del[k] = 1
								markers_appoint[k].setMap(null)
							}
							delete markers_appoint[k]
						}
					}))
					infoWindow.open(map)
				})
			}
			else {
				point.addListener('click', e => {
					infoWindow.setPosition(latLng);
					infoWindow.setContent(createTempWaiting("Điểm hẹn "+point.label, undefined, undefined, () => {
						if (confirm("Bạn muốn xóa điểm hẹn này không ?")) {
							infoWindow.close()
							db.ref("appoint/"+k).set({})
							if (markers_appoint[k]) {
								del[k] = 1
								markers_appoint[k].setMap(null)
							}
							delete markers_appoint[k]
						}
					}))
					infoWindow.open(map);
				})
			}
		}
		function hideMark(arr = []) {for (let k in arr) {if (arr[k]) arr[k].setMap(null)}}

		// check busy
		let busyListener, appRef
		db.ref("user/"+user.uid+"/isBusy").on("value", snap => {
			let busy = snap.val()
			if (busy) {
				$(clearIcon).css("display", 'block')
				$(addMarkIcon).css("display", 'block')
				busyListener = map.addListener('click', e => {
					if (!markerIconToggle) return
					markerIconToggle = 0
					$(addMarkIcon).css('background', 'white')
					addAppointment({lat: e.latLng.lat(), lng: e.latLng.lng()}, map, user.uid)
				})
				// get data
				let reqid = $(".accepted").attr("reqid")
				appRef = db.ref("appoint").orderByChild("reqid").equalTo(String(reqid))
				appRef.on('value', snap => {
					// clear
					removeOptionSelector(startPlace); removeOptionSelector(endPlace)
					hideMark(markers_appoint)
					for (let k in markers_appoint) {if (markers_appoint[k]) markers_appoint[k].setMap(null)}
					markers_appoint = []
					// add
					arrAppoint = snap.val()
					for (let k in arrAppoint) {
						if (del[k]) continue
						let cnt = arrAppoint[k][busy]+arrAppoint[k][user.uid]
						if (cnt >= 2) addComplete(arrAppoint[k].geolocation, map, k)
						else addTemp(arrAppoint[k].geolocation, map, k, arrAppoint[k][user.uid])
					}
					setOptionSelector(startPlace, markers_complete); setOptionSelector(endPlace, markers_complete)
				})
			}
			else {
				hideMark(markers_appoint); hideMark(markers_complete)
				markers_appoint = []
				markers_complete = []
				removeOptionSelector(startPlace); removeOptionSelector(endPlace)
				$(clearIcon).css("display", 'none')
				$(addMarkIcon).css("display", 'none')
				if (busyListener) google.maps.event.removeListener(busyListener);
				if (appRef) appRef.off()
			}
		})
		function addAppointment(latLng, map, clicker, to) {
			let newpoint = db.ref("appoint").push()
			let postData = {
				geolocation: latLng, 
				reqid: String($(".accepted").attr("reqid")), 
				[user.uid]: 1
			}
			newpoint.set(postData)	
		}
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
			let labelsatellite = newElement("LABEL"); $(labelsatellite).attr("for", "satellite"); let imgsatellite = newElement("IMG"); $(labelsatellite).attr("src", "./img/mapsatellite.png"); labelsatellite.append(imgsatellite)
			let inputsatellite = newElement("INPUT"); $(inputsatellite).attr({type: "radio", name: "mapsatellite", value:"satellite", id:"satellite"})
		div.append(labelsatellite); div.append(inputsatellite)
			let labelassasin = newElement("LABEL"); $(labelassasin).attr('for', 'assasin'); let imgassasin = newElement("IMG"); $(imgassasin).attr('src', "./img/mapassasin.png"); labelassasin.append(imgassasin)
			let inputassasin = newElement("INPUT"); $(inputassasin).attr({type: 'radio', name: 'maptype', value: 'assasin', id: 'assasin'})
		div.append(inputassasin); div.append(labelassasin); 
		return div
	}
	function removeOptionSelector(selector) {while (selector.childElementCount > 1) selector.lastChild.remove()}
	function setOptionSelector(selector, arr) {
		for (let k in arr) {
			let opt = newElement("OPTION"); opt.innerHTML = "Điểm hẹn "+arr[k].id
			$(opt).attr('value', k)
			selector.append(opt)
		}
		// user point
		let opt = newElement("OPTION"); opt.innerHTML = "Tôi"
		$(opt).attr('value', user.uid)
		selector.append(opt)
		opt = newElement("OPTION"); opt.innerHTML = (user.moreinfo.type == 'guide') ? 'visitor' : 'guide'
		$(opt).attr('value', user.isBusy)
		selector.append(opt)
	}
	function createTopPane() {
		let div = newElement("DIV")
		$(div).attr('id', 'map-top-push')
			let input = newElement("INPUT", "form-control")
			$(input).attr({id: "map-input", type: "text", placeholder: "Tìm kiếm"})
			let selectStart = newElement("SELECT", "custom-select mr-sm-2"); $(selectStart).attr('id', "direction-start")
				let opt = newElement("OPTION"); $(opt).attr("selected", ""); opt.innerHTML = "Xuất phát"
				$(opt).attr('value', 0)
			selectStart.append(opt);
			let selectEnd = newElement("SELECT", "custom-select mr-sm-2"); $(selectEnd).attr('id', "direction-end")
				opt = newElement("OPTION"); $(opt).attr("selected", ""); opt.innerHTML = 'Kết thúc'
				$(opt).attr('value', 0)
			selectEnd.append(opt);
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
	function createClearIcon() {
		let div = newElement("DIV", "btn btn-light")
		$(div).attr("id", "map-clear").css("padding", "5px").css("margin", "0 10px").css("display", 'none')
			let img = newElement("IMG")
			$(img).attr("src", "./img/mapclear.png")
		div.append(img)
		return div
	}
	function createAddMarkIcon() {
		let div = newElement("DIV", "btn btn-light")
		$(div).attr("id", "map-clear").css('padding', '0px').css("margin", "0 10px").css("display", 'none').css("background", "white")
			let img = newElement("IMG")
			$(img).attr("src", "./img/mapmark.png")
		div.append(img)
		return div
	}
	function createTempInfo(title ="Điểm hẹn", time = "30/04/1975", detail = "Chi tiết", cb1, cb2) {
		let card = newElement("DIV")
			let body = newElement("DIV", "card-body"); $(body).css("padding", "0.5rem")
				let _title = newElement("h6", "card-title", title)
				let _time = newElement("h6", "card-subtitle mb-2 text-muted", time)
				let p = newElement("P", "card-text", detail)
				let span1 = newElement("SPAN", "badge badge-pill badge-success btn btn-success", "Đồng Ý"); $(span1).css("width", "60px"); $(span1).click(cb1)
				let span2 = newElement("SPAN", "badge badge-pill badge-danger", "Xóa"); $(span2).css("width", "60px"); $(span2).click(cb2)
			body.append(_title)
			body.append(_time)
			body.append(p)
			body.append(span1)
			body.append(span2)
		card.append(body)
		return card
	}
	function createTempWaiting(title ="Điểm hẹn", time = "30/04/1975", detail = "Chi tiết", cb) {
		let card = newElement("DIV")
			let body = newElement("DIV", "card-body"); $(body).css("padding", "0.5rem")
				let _title = newElement("h6", "card-title", title)
				let _time = newElement("h6", "card-subtitle mb-2 text-muted", time)
				let p = newElement("P", "card-text", detail)
				let span1 = newElement("SPAN", "badge badge-pill badge-secondary btn btn-secondary", "Đang chờ..."); $(span1).css("width", "60px")
				let span2 = newElement("SPAN", "badge badge-pill badge-danger btn btn-danger", "Xóa"); $(span2).css("width", "60px"); $(span2).click(cb)
			body.append(_title)
			body.append(_time)
			body.append(p)
			body.append(span1)
			body.append(span2)
		card.append(body)
		return card
	}
	function createCompleteInfo(title ="Điểm hẹn", time = "30/04/1975", detail = "Chi tiết", cb1, cb2) {
		let card = newElement("DIV")
			let body = newElement("DIV", "card-body"); $(body).css("padding", "0.5rem")
				let _title = newElement("h6", "card-title", title)
				let _time = newElement("h6", "card-subtitle mb-2 text-muted", time)
				let p = newElement("P", "card-text", detail)
				let span1 = newElement("SPAN", "badge badge-pill badge-primary btn btn-primary", "Trở về"); $(span1).css("width", "60px"); $(span1).click(cb1)
				let span2 = newElement("SPAN", "badge badge-pill badge-danger btn btn-danger", "Xóa"); $(span2).css("width", "60px"); $(span2).click(cb2)
			body.append(_title)
			body.append(_time)
			body.append(p)
			body.append(span1)
			body.append(span2)
		card.append(body)
		return card
	}
	incProBar();
}
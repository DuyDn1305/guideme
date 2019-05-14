console.log('googleapi.js loaded')
var map, infoWindow;

function initMap() {
  map = new google.maps.Map(xMap, {
    center: {lat: -34.397, lng: 150.644},
    zoom: 6,
    //mapTydeId: google.maps.MapTypeId.ROADMAP
  });
  console.log(list.uid)
  list.uid.forEach(i => {
    //console.log(i)
    if (i != myInfo.uid) {
      k = list.data[i].moreinfo
      //console.log(k)
      let addPos = {lat: k.positionLat, lng: k.positionLng}
      //console.log(addPos)
      if (addPos != null) var marker = new google.maps.Marker({position: addPos, map: map});
    }
  })
  console.log('marker loaded')
  infoWindow = new google.maps.InfoWindow;
}

function focusMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      //db.ref('user/'+user+'/position').update({
      //  position: pos
      //})
      infoWindow.setPosition(pos);
      infoWindow.setContent("Location found");
      infoWindow.open(map);
      map.setCenter(pos);
      if (myInfo != null) db.ref('user/' + myInfo.uid+'/moreinfo').update({
        positionLat: pos.lat, 
        positionLng: pos.lng
      });
      //console.log(pos)
      const listPos = [
        {lat: 10.027625, lng: 105.760962},
        {lat: 10.0387388, lng:105.7615627},
        {lat: 10.038756, lng: 105.739528}
      ] 
      //renderMap(listPos)
      //var uluru = {lat: 10.0387388, lng:105.7615627};
      
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
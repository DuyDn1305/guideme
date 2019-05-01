<!-- cai exttenxsion chua v, cai live share extension pack do. Cai chat dau roi -->

<!-- roi ma-->
<!DOCTYPE html>
<html>
  <head>
    
    <style>
       /* Set the size of the div element that contains the map */
      #map {
        height: 400px;  /* The height is 400 pixels */
        width: 100%;  /* The width is the width of the web page */
       }
    </style>
  </head>
  <body>
    <h3>My Google Maps Demo</h3>
    <!--The div element for the map -->
    <div id="map"></div>
    <script>
// Initialize and add the map
function initMap() {
  // The location of Uluru
  var hcm = {lat: 10.756774, lng: 106.650210};
  var ct = {lat: 10.0056518, lng: 105.7815058};
  var hn = {lat: 21.0293731, lng: 105.772565};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: hcm});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: hcm, map: map});
  var marker = new google.maps.Marker({position: ct, map: map});
  var marker = new google.maps.Marker({position: hn, map: map});
}
    </script>
    <!--Load the API from the specified URL
    * The async attribute allows the browser to render the page while the API loads
    * The key parameter will contain your own API key (which is not needed for this tutorial)
    * The callback parameter executes the initMap() function
    -->
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxmtSpYlPsOcoFz9knDyQwCbtanPjtwkU&callback=initMap">
    </script>
  </body>
</html>
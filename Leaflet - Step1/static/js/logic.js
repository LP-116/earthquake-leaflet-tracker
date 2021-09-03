var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5,
});

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
  });

function magnitudeColor(magnitude)  {
    switch (true) {
    case (magnitude >= 5):
        return "#ea2c2c";
    case (magnitude > 4):
        return "#ea822c";
    case (magnitude > 3):
        return "#ee9c00";
    case (magnitude > 2):
        return "#eecc00";
    case (magnitude > 1):
        return "#d4ee00";
    
    }

}

function styleDetail(features) {
    return {
        fillColor: magnitudeColor(features.properties.mag),
        fillOpacity: 0.7
    }
}


function createFeatures(earthquakeData) {

    function onEachFeature(features, layer) {
        layer.bindPopup("<h3>" + features.properties.place +
          "</h3><hr><p>" + features.properties.mag + "</p>");
      }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(features, latlng) {
            return L.circleMarker(latlng);},
        style: styleDetail,
        onEachFeature: onEachFeature
      }).addTo(myMap)
     

      createMap(earthquakes);
    }


function createMap(earthquakes) {

    

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY


}).addTo(myMap);
}

    
      
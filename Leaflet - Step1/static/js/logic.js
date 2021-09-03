var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + feature.properties.mag + "</p>");
      }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
      });
    
      createMap(earthquakes);
    }


function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var baseMaps = {
      "Street Map": streetmap
  };

  var overlayMaps = {
      Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
      center: [37.7749, -122.4194],
      zoom: 5,
      layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);


}
        

  
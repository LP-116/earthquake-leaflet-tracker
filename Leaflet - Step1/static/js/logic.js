var myMap = L.map("map", {
    center: [36.0544, -112.1401],
    zoom: 5,
});

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
  });

function magnitudeColor(depth)  {
    switch (true) {
    case (depth >= 90):
        return "#ff0000";
    case (depth > 70):
        return "#ff8000";
    case (depth > 50):
        return "#ffbf00";
    case (depth > 30):
        return "#ffff00";
    case (depth > 10):
        return "#bfff00";
    case (depth > -10):
        return "#00ff80";
    
    }

}

function styleDetail(features) {
    return {
        weight: 0.4,
        color: "black",
        fillColor: magnitudeColor(features.geometry.coordinates[2]),
        fillOpacity: 0.7,
        radius: (features.properties.mag) *4
    }
}

function legendColor(d) {
    return d > 90 ? '#ff0000' :
           d > 70 ? '#ff8000' :
           d > 50  ? '#ffbf00' :
           d > 30  ? '#ffff00' :
           d > 10  ? '#bfff00':
                     '#00ff80';

}

// function getColor(d) {
//     return d > 1000 ? '#800026' :
//            d > 500  ? '#BD0026' :
//            d > 200  ? '#E31A1C' :
//            d > 100  ? '#FC4E2A' :
//            d > 50   ? '#FD8D3C' :
//            d > 20   ? '#FEB24C' :
//            d > 10   ? '#FED976' :
//                       '#FFEDA0';
// }

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
      }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (map) {
      
          var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          labels = [];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<div><i style="background:' + legendColor(grades[i] + 1) + '"></i> ' + 
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+' +'</div>');
      }
      
      return div;
      };
      
      legend.addTo(myMap);
   
     

      createMap(earthquakes);
    };


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

// var legend = L.control({position: 'bottomright'});

//       legend.onAdd = function (map) {
      
//           var div = L.DomUtil.create('div', 'info legend'),
//           grades = [-10, 10, 30, 50, 70, 90],
//           labels = [];
      
//           // loop through our density intervals and generate a label with a colored square for each interval
//           for (var i = 0; i < grades.length; i++) {
//               div.innerHTML +=
//                   '<i style="background:' + legendColor(grades[i] + 1) + '"></i> ' +
//                   grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//       }
      
//       return div;
//       };
      
//       legend.addTo(myMap);
      
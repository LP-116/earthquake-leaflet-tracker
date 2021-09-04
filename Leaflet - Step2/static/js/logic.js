
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(earthquakeUrl).then(function(data) {
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
        return "#66ff8c";
    
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
                     '#66ff8c';

}

function createFeatures(earthquakeData) {

    function onEachFeature(features, layer) {
        layer.bindPopup("<strong>" + (features.properties.place).split("of").pop() + "</strong>" +
          "<li>"+"Magnitude:" + features.properties.mag + "</li>" + "<li>" + "Depth:" + features.geometry.coordinates[2]+ "</li>" );
      }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(features, latlng) {
            return L.circleMarker(latlng);},
        style: styleDetail,
        onEachFeature: onEachFeature
      })

    console.log(earthquakes)
    
    createMap(earthquakes);

    };


function createMap(earthquakes) {

    var tectonicplates = L.layerGroup();

    d3.json(tectonicPlatesUrl).then(function(data) {
        L.geoJSON(data, {
            color: "orange"
        }).addTo(tectonicplates)
    });


    var lightlayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    });

    var satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
    });

    var outdoorsLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    });

    var baseMaps = {
        "Grayscale": lightlayer,
        "Satellite": satelliteLayer,
        "Outdoors": outdoorsLayer
    }

    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicplates
    };


    var myMap = L.map("map", {
        center: [36.0544, -112.1401],
        zoom: 3,
        layers:[lightlayer, satelliteLayer, outdoorsLayer, earthquakes, tectonicplates]
    });


     var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (map) {
      
          var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          labels = [];
      
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<div><i style="background:' + legendColor(grades[i] + 1) + '"></i> ' + 
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+' +'</div>');
      }
      
      return div;
      };

      legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false


}).addTo(myMap);
}

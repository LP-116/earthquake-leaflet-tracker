
// geoJson data url's
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Perform a GET request to the query earthquake URL.
d3.json(earthquakeUrl).then(function(data) {

    // Sending the data.features object to the createFeatures Function.
    createFeatures(data.features);
  });


//  Function used to determine the color of the circle.
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


//  Function used to build the legend colors.
function legendColor(d) {
    return d > 90 ? '#ff0000' :
           d > 70 ? '#ff8000' :
           d > 50  ? '#ffbf00' :
           d > 30  ? '#ffff00' :
           d > 10  ? '#bfff00':
                     '#66ff8c';

}

//  Function used to create the circle markers and add a popup box.
// This is run once for each feature in the features array.
function createFeatures(earthquakeData) {

    // The popup box display's the place (reformatted from the original result so it appears over 2 lines), the earthquake magnitude and depth.
    function onEachFeature(features, layer) {
        layer.bindPopup("<strong>" + (features.properties.place).split("of")[0] + "of" +"</strong>" + "<br><strong>" + (features.properties.place).split("of").pop() + "</strong>" +
          "<li>"+"Magnitude:" + features.properties.mag + "</li>" + "<li>" + "Depth:" + features.geometry.coordinates[2]+ "</li>" );
      }

    //  Creating a GeoJson layer for the earthquakeData object and adding the styles to the circles.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(features, latlng) {
            return L.circleMarker(latlng, {
                weight: 0.4,
                color: "black",
                fillColor: magnitudeColor(features.geometry.coordinates[2]),
                fillOpacity: 0.7,
                radius: (features.properties.mag) *4
            });
        },
        onEachFeature: onEachFeature
      })
    
    //  Sending the earthquake layer to the createMap function.
    createMap(earthquakes);

    };


function createMap(earthquakes) {

    // Adding a layergroup for the tectonic plates.
    var tectonicplates = L.layerGroup();

    // Reading the tectonic plates URL using d3, creating the geojson layer and adding it to the tectonicplates layer.
    d3.json(tectonicPlatesUrl).then(function(data) {
        L.geoJSON(data, {
            color: "orange"
        }).addTo(tectonicplates)
    });


    // Defining the grayscale/light layer.
    var lightlayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    });

    // Defining the satellite layer.
    var satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
    });

    // Defining the outdoor layer.
    var outdoorsLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    });

    // Defining the basemap object with all our base layers. 
    var baseMaps = {
        "Grayscale": lightlayer,
        "Satellite": satelliteLayer,
        "Outdoors": outdoorsLayer
    }

    // Creating the overlays object to hold the earthquake and tectonic plates layers.
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicplates
    };


    // Creating the map and layers to display on loading the screen.
    var myMap = L.map("map", {
        center: [40.7128, -74.0060],
        zoom: 3,
        layers:[outdoorsLayer, earthquakes, tectonicplates]
    });


    // Creating the legend and adding it to the map.
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

    // Creating the layer control.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false


}).addTo(myMap);
}

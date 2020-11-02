// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) { 
    let depth = feature.geometry.coordinates[2];
    let magnitude=  feature.properties.mag;        
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " +magnitude+ "</p> <p>Depth (km): " +depth+"</p>", {maxWidth:"auto"});
} 
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // Thanks to https://codepen.io/dagmara223/pen/LWYNJO (apparently colors aren't colors, they are styles, b/c - who knows)
  var earthquakes = L.geoJSON(earthquakeData, {
    style: function(feature) {
      let depth = feature.geometry.coordinates[2]; 
      if (depth >= 90) {
        return {
          color: "red"
        }; 
      }
      else if (depth >= 70) {
        return {
          color: "orangered"
        };
      } else if (depth >= 50) {
        return {
          color: "orange"
        };
      } else if (depth >= 30) {
        return {
          color: "yellow"
        };
      } else if (depth >= 10) {
        return {
          color: "gold"
        };
      } else {
        return {
          color: "green"
        }
      }
    },

    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: (2**(feature.properties.mag))/5, 
        fillOpacity: 0.85,

      });
  },

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};
function createMap(earthquakes) {
  // Define streetmap and satellite layers
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "mapbox/satellite-streets-v9",
    accessToken: API_KEY,
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the satellite, streetmap, and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      28, -115
    ],
    zoom: 3,
    layers: [satellitemap, streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

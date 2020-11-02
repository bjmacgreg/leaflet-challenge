// Thanks to https://github.com/PetraLee2019/ (suspected former Bootcamp student) for help with plate lines
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

//Plate boundaries (get cookie error? But apparently not fatal)
var fraxenPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
console.log(fraxenPlates);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
});

//Get and style plate boundary lines
var plateBoundary = new L.LayerGroup();
d3.json(fraxenPlates, function (boundaries) {
    L.geoJSON(boundaries.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'magenta'
            }
        },
    }).addTo(plateBoundary);
})

function createFeatures(earthquakeData) {
  // Define a function to run once for each feature in the features array
  // Make popups showing earthquake time, location, and magnitude
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
          fill: "red"
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
          color: "yellowgreen"
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

  //Send earthquakes layer to the createMap function
  createMap(earthquakes);
};

function createMap(earthquakes) {
  //Define streetmap and satellite layers
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

  //Define baseMaps object to hold base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Street Map": streetmap
  };

  //Define overlayMaps object to hold overlay layers
  var overlayMaps = {
    "Boundaries": plateBoundary,
    "Earthquakes": earthquakes
  };

  //Create map, with streetmap and earthquakes layers to be displayed on load
  var myMap = L.map("map", {
    center: [
      0, -0
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  //Layer control for toggling base and overlay layers (glad this is written for us!)
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

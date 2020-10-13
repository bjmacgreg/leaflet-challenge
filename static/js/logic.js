//url https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson

// Create the tile layer that will be the background of our map
var worldmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9.html?title=true&access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapid",
  //accessToken: API_KEY
});



// Initialize all of the LayerGroups we'll be using
// var layers = {
//     COMING_SOON: new L.LayerGroup(),
//     EMPTY: new L.LayerGroup(),
//     LOW: new L.LayerGroup(),
//     NORMAL: new L.LayerGroup(),
//     OUT_OF_ORDER: new L.LayerGroup()
//   };
// Create the map with our layers
var map = L.map("mapid", {
    center: [40.73, -74.0059],
    zoom: 18
    // layers: [
    //   layers.COMING_SOON,
    //   layers.EMPTY,
    //   layers.LOW,
    //   layers.NORMAL,
    //   layers.OUT_OF_ORDER
    // ]
  });
  

// Add our 'lightmap' tile layer to the map
worldmap.addTo(map);

// Create an overlays object to add to the layer control

// Create a control for our layers, add our overlay layers to it



// Create a legend to display information about our map



// When the layer control is added, insert a div with the class of "legend"


// Add the info legend to the map


// Initialize an object containing icons for each layer group


// Perform an API call to the USGS endpoint


// When the first API call is complete, perform another call to the USGS endpoint


// Create an object to keep of the number of markers in each layer


// Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group


// Loop through the stations (they're the same size and have partially matching data)

    // Create a new station object with properties of both station objects

    // If a station is listed but not installed, it's coming soon


    // If a station has no bikes available, it's empty

      // If a station is installed but isn't renting, it's out of order
      
      // If a station has less than 5 bikes, it's status is low


      // Otherwise the station is normal

      // Update the station count

      // Create a new marker with the appropriate icon and coordinates

    // Add the new marker to the appropriate layer
           
    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
         
      
// Call the updateLegend function, which will... update the legend!

// Update the legend's innerHTML with the last updated time and station count
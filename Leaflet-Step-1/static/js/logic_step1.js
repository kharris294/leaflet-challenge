var linkEQ = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function getColor(d) {
    return d > 5 ? '#ff0000' :
           d > 4 ? '#ff3300' :
           d > 3 ? '#ff6600' :
           d > 2 ? '#ff9900' :
           d > 1 ? '#ccff00' :
                   '#99ff00';
}

d3.json(linkEQ, function(EQdata) {  
    createFeatures(EQdata.features);  
});


function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><hr><p>Time: " + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p>");    
  }
  
  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {radius: feature.properties.mag * 5,
                                        fillColor: getColor(feature.properties.mag),
                                        color: "#000",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.8});
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}


function createMap(earthquakes) {
    
    var streetmap =
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend");
        grades = [0, 1, 2, 3, 4, 5];
        labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=            
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

        return div;
    };

    legend.addTo(myMap);

}
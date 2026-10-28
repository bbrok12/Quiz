//add map from leaflet library
const map = L.map('testMap').setView([38, -95], 5);

//add basemap control widget
/* const basemapControl = L.basemapControl({
    position: 'topright',
    layers: [
        {
            layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
        },
        {
            layer: L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
        },
        {
            layer: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
                minZoom: 0,
                maxZoom: 20,
                attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                ext: 'jpg'
            })
        }
    ]
}).addTo(map); */

/* var basemapControl = L.basemapControl({
    position: 'topright',
    layers: [
        {Stadia_StamenTonerDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'}

    ]
}).addTo(map) */
/* const Stadia_StamenTonerDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map); */
const airportLayer = L.featureGroup();
const airportIcon = L.icon({
    iconUrl: 'images/icons8-airport-24.png',
    iconSize: [15,15]
});

airports.forEach(function (course) {
    L.marker([course.lat, course.lon], {icon: airportIcon})
        .bindPopup(course.name)
        .addTo(airportLayer);
});
var navaid_url =
"https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/NAVAIDSystem/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
function getColor(status) {
    if (status == 'RESTRICTED') return 'yellow';
    if (status == 'IFR') return 'green';
    if (status == 'CLOSED') return 'red';
    if (status == 'DECOMM') return 'grey';
    return 'white';
}
var navaid_layer;
$.getJSON(navaid_url, function (data) {
    console.log("Data received");
    navaid_layer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            var status = feature.properties.STATUS || '';
            var alertColor = getColor(status);

            return L.circleMarker(latlng, {
                radius: 6,
                fillColor: alertColor,
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                '<h3>' + feature.properties.NAME_TXT + '</h3>' +
                '<strong>Status:</strong> ' + feature.properties.STATUS +
                '<br><strong>Message:</strong> ' + feature.properties.REMARKS
            );
        }
    }).addTo(map)
    layerControl.addOverlay(navaid_layer, "NAVAID Layer");
});


const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map)
const sattelite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'
});

const baseLayers = {
    "Open Street Map": osm,
    "Satelite": sattelite
};
const overlays = {
    "Regional Airports": airportLayer,
    //"NAVAID Layer": navaid_layer
}

const layerControl = L.control.layers(baseLayers, overlays).addTo(map);

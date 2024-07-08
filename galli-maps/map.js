const API_KEY = 'a453078f-e401-479b-ad07-24236aae961c'; // Replace with your actual API key
let map;
let markers = [];

function initMap() {
    const galliMapsObject = {
        accessToken: API_KEY,
        map: { 
            container: 'map', 
            center: [0, 0], 
            zoom: 2, 
            maxZoom: 18, 
            minZoom: 2,
            clickable: true
        }
    };

    map = new GalliMapPlugin(galliMapsObject);

    addMarkersToMap();
}

function addMarkersToMap() {
    recommendations.forEach(loc => {
        let pinMarkerObject = {
            color: "#FF0000",
            draggable: false,
            latLng: [loc.latitude, loc.longitude]
        };
        let marker = map.displayPinMarker(pinMarkerObject);

        marker.on('click', function() {
            showRecommendationDetails(loc.id);
        });

        markers.push({id: loc.id, marker: marker});
    });
}

function drawRoute(route) {
    // Remove previous route if exists
    if (window.routeLayer) {
        map.removeLayer(window.routeLayer);
    }

    const coordinates = route.map(id => {
        const rec = recommendations.find(r => r.id === id);
        return [rec.longitude, rec.latitude];
    });

    const routeObject = {
        name: "route",
        color: "blue",
        opacity: 0.7,
        width: 3,
        geoJson: {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        }
    };

    window.routeLayer = map.drawPolygon(routeObject);
}
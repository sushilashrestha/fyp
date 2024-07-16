const API_KEY = 'a453078f-e401-479b-ad07-24236aae961c'; // Replace with your actual API key
let map;
let markers = [];
let isShowing = 0;

const recommendations = [
    { id: 1, name: "Bhaktapur Durbar Square", latitude: 27.6722, longitude: 85.4285, description: "A historic royal palace complex with courtyards, temples, and statues.", rating: 4.7 },
    { id: 2, name: "Nyatapola Temple", latitude: 27.6710, longitude: 85.4308, description: "A five-story pagoda temple known for its impressive architecture.", rating: 4.8 },
    { id: 3, name: "Taumadhi Square", latitude: 27.6705, longitude: 85.4306, description: "A vibrant square featuring the Nyatapola Temple and other historical structures.", rating: 4.6 },
    { id: 4, name: "Dattatreya Temple", latitude: 27.6743, longitude: 85.4321, description: "A unique three-roofed temple dedicated to the Hindu trinity.", rating: 4.5 },
    { id: 5, name: "55 Window Palace", latitude: 27.6722, longitude: 85.4289, description: "An intricately carved palace with 55 windows and historical significance.", rating: 4.7 }
];


function initMap() {
    const galliMapsObject = {
        accessToken: API_KEY,
        map: { 
            container: 'map', 
            center: [27.6710, 85.4298], 
            zoom: 14, 
            maxZoom: 100, 
            minZoom: 2,
            clickable: true
        },
        pano: { container: 'pano', },
    };

    map = new GalliMapPlugin(galliMapsObject);
}

function addMarkersToMap() {

    isShowing = 1 - isShowing;

     if (isShowing == 1){
         
         recommendations.forEach(loc => {
             let pinMarkerObject = {
                 color: "#8A2BE2", // Blue violet
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
     else {
        markers.forEach(marker => {
            map.removePinMarker(marker.marker);
        });
        markers = [];
     }
}

function displayRecommendationList() {
    const listDiv = document.getElementById('recommendation-list');
    let listHTML = '<h2>Top Recommendations</h2><ul>';
    recommendations.forEach(rec => {
        listHTML += `<li onclick="showRecommendationDetails(${rec.id})">${rec.name} - Rating: ${rec.rating}/5</li>`;
    });
    listHTML += '</ul>';
    listDiv.innerHTML = listHTML;
}

function showRecommendationDetails(id) {
    const location = recommendations.find(rec => rec.id === id);
    const detailsDiv = document.getElementById('recommendation-details');
    detailsDiv.innerHTML = `
        <h2>${location.name}</h2>
        <p>${location.description}</p>
        <p>Rating: ${location.rating}/5</p>
    `;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

function findShortestRoute() {
    const route = [];
    const unvisited = [...recommendations];
    
    let currentPoint = unvisited.shift();
    route.push(currentPoint.id);

    while (unvisited.length > 0) {
        let nearestIndex = 0;
        let shortestDistance = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
            const distance = calculateDistance(
                currentPoint.latitude, currentPoint.longitude,
                unvisited[i].latitude, unvisited[i].longitude
            );

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestIndex = i;
            }
        }

        currentPoint = unvisited[nearestIndex];
        route.push(currentPoint.id);
        unvisited.splice(nearestIndex, 1);
    }

    return route;
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
        color: "#8A2BE2", // Blue violet
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

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    displayRecommendationList();

    document.getElementById('show-recommendations-button').addEventListener('click', function() {
        console.log('Show Recommendations button clicked'); // Clear existing markers
        addMarkersToMap();
    });

    document.getElementById('route-button').addEventListener('click', function() {
        console.log('Find Shortest Route button clicked');
        const shortestRoute = findShortestRoute();
        console.log('Shortest route:', shortestRoute);
        drawRoute(shortestRoute);
    });
});
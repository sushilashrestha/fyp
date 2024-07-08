document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'a453078f-e401-479b-ad07-24236aae961c'; // Replace with your actual API key

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

    const map = new GalliMapPlugin(galliMapsObject);

    // Sample recommendations data
    const recommendations = [
        { id: 1, name: "Eiffel Tower", latitude: 48.8584, longitude: 2.2945, description: "Iconic iron lattice tower in Paris.", rating: 4.5 },
        { id: 2, name: "Taj Mahal", latitude: 27.1751, longitude: 78.0421, description: "Stunning marble mausoleum in Agra.", rating: 4.8 },
        { id: 3, name: "Great Wall of China", latitude: 40.4319, longitude: 116.5704, description: "Ancient fortification spanning thousands of miles.", rating: 4.7 },
        { id: 4, name: "Machu Picchu", latitude: -13.1631, longitude: -72.5450, description: "Ancient Inca city in the Peruvian Andes.", rating: 4.9 },
        { id: 5, name: "Colosseum", latitude: 41.8902, longitude: 12.4922, description: "Iconic ancient Roman amphitheater.", rating: 4.6 }
    ];

    function addMarkersToMap(recommendations) {
        recommendations.forEach(loc => {
            let pinMarkerObject = {
                color: "#FF0000",
                draggable: false,
                latLng: [loc.latitude, loc.longitude]
            };
            let marker = map.displayPinMarker(pinMarkerObject);

            marker.on('click', function() {
                showRecommendationDetails(loc);
            });
        });
    }

    function showRecommendationDetails(location) {
        const detailsDiv = document.getElementById('recommendation-details');
        detailsDiv.innerHTML = `
            <h2>${location.name}</h2>
            <p>${location.description}</p>
            <p>Rating: ${location.rating}/5</p>
        `;
    }

    function displayRecommendationList(recommendations) {
        const listDiv = document.getElementById('recommendation-list');
        let listHTML = '<h2>Top Recommendations</h2><ul>';
        recommendations.forEach(rec => {
            listHTML += `<li onclick="showRecommendationDetails(${JSON.stringify(rec)})">${rec.name} - Rating: ${rec.rating}/5</li>`;
        });
        listHTML += '</ul>';
        listDiv.innerHTML = listHTML;
    }

    // Custom click function for the map
    const customClickFunction = (event) => {
        console.log(`Clicked at: ${event.lngLat.lat}, ${event.lngLat.lng}`);
        // You could add functionality here, like showing nearby recommendations
    };

    galliMapsObject.customClickFunctions = [customClickFunction];

    // Initialize the map with recommendations
    addMarkersToMap(recommendations);
    displayRecommendationList(recommendations);

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredRecommendations = recommendations.filter(rec => 
            rec.name.toLowerCase().includes(searchTerm) || 
            rec.description.toLowerCase().includes(searchTerm)
        );
        displayRecommendationList(filteredRecommendations);
    });
});

// Global function to show recommendation details (for list item clicks)
function showRecommendationDetails(location) {
    const detailsDiv = document.getElementById('recommendation-details');
    detailsDiv.innerHTML = `
        <h2>${location.name}</h2>
        <p>${location.description}</p>
        <p>Rating: ${location.rating}/5</p>
    `;
}
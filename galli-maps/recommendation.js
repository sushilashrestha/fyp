const recommendations = [
    { id: 1, name: "Bhaktapur Durbar Square", latitude: 27.6722, longitude: 85.4285, description: "A historic royal palace complex with courtyards, temples, and statues.", rating: 4.7 },
    { id: 2, name: "Nyatapola Temple", latitude: 27.6710, longitude: 85.4308, description: "A five-story pagoda temple known for its impressive architecture.", rating: 4.8 },
    { id: 3, name: "Taumadhi Square", latitude: 27.6705, longitude: 85.4306, description: "A vibrant square featuring the Nyatapola Temple and other historical structures.", rating: 4.6 },
    { id: 4, name: "Dattatreya Temple", latitude: 27.6743, longitude: 85.4321, description: "A unique three-roofed temple dedicated to the Hindu trinity.", rating: 4.5 },
    { id: 5, name: "55 Window Palace", latitude: 27.6722, longitude: 85.4289, description: "An intricately carved palace with 55 windows and historical significance.", rating: 4.7 }
];


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
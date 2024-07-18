async function getRecommendations() {
    const types = Array.from(document.getElementById('types').selectedOptions).map(option => option.value);
    const budget = document.getElementById('budget').value;
    const time = document.getElementById('time').value;
    
    const response = await fetch(`/api/recommendations?types=${encodeURIComponent(types.join(','))}&budget=${budget}&time=${time}`);
    const recommendations = await response.json();

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h2>Recommended Attractions:</h2>';

    if (recommendations.length === 0) {
        recommendationsDiv.innerHTML += '<p>No recommendations found.</p>';
    } else {
        const ul = document.createElement('ul');
        recommendations.forEach(([name, similarity]) => {
            const li = document.createElement('li');
            li.textContent = `${name} - Similarity: ${similarity.toFixed(2)}`;
            li.onclick = () => getAttractionDetails(name);
            li.style.cursor = 'pointer';
            ul.appendChild(li);
        });
        recommendationsDiv.appendChild(ul);
    }
}

async function getAttractionDetails(name) {
    const response = await fetch(`/api/attraction?name=${encodeURIComponent(name)}`);
    const attraction = await response.json();

    const detailsDiv = document.getElementById('attraction-details');
    detailsDiv.innerHTML = `
        <h2>${attraction.name}</h2>
        <p><strong>Type:</strong> ${attraction.type}</p>
        <p><strong>Opening Hours:</strong> ${attraction.opening_hour} - ${attraction.closing_hour}</p>
        <p><strong>Entry Fee:</strong> ₹${attraction.entry_fee}</p>
        <p><strong>Location:</strong> ${attraction.location}</p>
        <p><strong>Description:</strong> ${attraction.description}</p>
    `;
}
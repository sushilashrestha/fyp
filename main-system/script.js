async function getRecommendations() {
    const interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);
    const budget = document.getElementById('budget').value;
    const time = document.getElementById('time').value;
    
    const response = await fetch(`/api/recommendations?interests=${encodeURIComponent(interests.join(','))}&budget=${budget}&time=${time}`);
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
        <p><strong>Entry Fee:</strong> $${attraction.entry_fee}</p>
        <p><strong>Opening Hours:</strong> ${attraction.opening_hour}:00 - ${attraction.closing_hour}:00</p>
        <p><strong>Type:</strong> ${attraction.attraction_type}</p>
        <p><strong>Interests:</strong> ${attraction.interests.join(', ')}</p>
    `;
}
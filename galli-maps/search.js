function initSearch() {
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
}
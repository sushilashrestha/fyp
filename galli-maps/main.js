document.getElementById('route-button').addEventListener('click', function() {
    console.log('Button clicked');
    const shortestRoute = findShortestRoute();
    console.log('Shortest route:', shortestRoute);
    drawRoute(shortestRoute);
});
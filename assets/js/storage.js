// Start Leaflet-kortet
var map = L.map('map').setView([55.6761, 12.5683], 10); // Standard: København

// Tilføj OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Hent gemte positioner fra LocalStorage
let savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];

// Tilføj alle gemte lokationer som markører
savedLocations.forEach(loc => {
    L.marker([loc.lat, loc.lng]).addTo(map)
      .bindPopup(`${loc.name} <br> <button onclick="removeLocation(${loc.lat}, ${loc.lng})">Slet</button>`);
});

// Få brugerens nuværende position
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            // Zoom til brugerens position
            map.setView([latitude, longitude], 12);

            // Tilføj markør for nuværende position
            L.marker([latitude, longitude]).addTo(map)
              .bindPopup("Din nuværende position").openPopup();
        }, (error) => {
            console.error("Fejl ved at hente GPS:", error);
        });
    } else {
        console.error("Geolocation understøttes ikke i denne browser.");
    }
}

// Funktion til at gemme lokation
function saveLocation(name, lat, lng) {
    let locations = JSON.parse(localStorage.getItem("savedLocations")) || [];
    locations.push({ name, lat, lng });
    localStorage.setItem("savedLocations", JSON.stringify(locations));
}

// Funktion til at fjerne en gemt lokation
function removeLocation(lat, lng) {
    let locations = JSON.parse(localStorage.getItem("savedLocations")) || [];
    locations = locations.filter(loc => loc.lat !== lat && loc.lng !== lng);
    localStorage.setItem("savedLocations", JSON.stringify(locations));
    location.reload(); // Opdater kortet
}

// Kald funktionen til at få brugerens position
getUserLocation();

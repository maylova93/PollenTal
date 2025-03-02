import { getpollenData } from "./pollen.js";
import { getLocation } from "./location.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("📌 DOM Loaded, henter pollen-data...");
    
    getLocation(); // Hent brugerens GPS-position

    // Hent pollen-data for default lokation (København)
    const pollenData = await getpollenData(55.6761, 12.5683);

    if (pollenData) {
        buildPollenView(pollenData); // 📌 Opdater UI
    } else {
        console.error("❌ Ingen pollen-data modtaget.");
    }
});


// 📌 Hent GPS-lokation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getpollenData(latitude, longitude);
            },
            () => {
                getpollenData(55.6761, 12.5683); // Standard: København
            }
        );
    }
}

// 📌 Hent pollen-data baseret på byvalg
function getCoordinatesAndPollenData(city) {
    const cityCoordinates = {
        "Aalborg": { lat: 57.048, lon: 9.9217 },
        "Aarhus": { lat: 56.1629, lon: 10.2039 },
        "Copenhagen": { lat: 55.6761, lon: 12.5683 }
    };

    if (cityCoordinates[city]) {
        getpollenData(cityCoordinates[city].lat, cityCoordinates[city].lon);
    }
}

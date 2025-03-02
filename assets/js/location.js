import { getpollenData } from "./pollen.js";

document.addEventListener("DOMContentLoaded", () => {
    const locationSelect = document.getElementById("locationSelect");

    locationSelect.addEventListener("change", () => {
        const selectedLocation = locationSelect.value;
        console.log("📌 Valgt by:", selectedLocation); // Debug udskrift

        if (selectedLocation === "current") {
            getLocation();
        } else {
            getCoordinatesAndPollenData(selectedLocation);
        }
    });

    getLocation(); // Hent data for brugerens lokation ved start
});

// 📌 Hent GPS-lokation
export function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("📌 GPS Koordinater:", latitude, longitude);
            },
            (error) => {
                console.error("❌ GPS Fejl:", error);
            }
        );
    } else {
        console.error("❌ Geolocation understøttes ikke.");
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
        console.log(`📌 Henter pollen-data for ${city}`);
        getpollenData(cityCoordinates[city].lat, cityCoordinates[city].lon);
    } else {
        console.error("❌ Ukendt by:", city);
    }
}

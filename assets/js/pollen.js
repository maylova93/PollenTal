export async function getpollenData(lat, lon) {
    const timeZone = "Europe%2FBerlin";
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=${timeZone}&forecast_days=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fejl ved hentning af API");

        const data = await response.json();
        if (!data.current) throw new Error("Ingen aktuelle pollen-data!");

        console.log("📌 API-data modtaget:", data.current); // Debugging

        buildPollenView(data.current);  // 📌 Opdater UI med data

        return data.current;
    } catch (error) {
        console.error("❌ Fejl ved pollen-data:", error);
        document.getElementById("pollenData").innerHTML = `<p>Kunne ikke hente pollen-data.</p>`;
    }
}

// 📌 Funktion til at vise data på skærmen
function buildPollenView(data) {
    let myDisplayElement = document.getElementById("pollenData");

    if (!myDisplayElement) {
        console.error("❌ Elementet 'pollenData' blev ikke fundet.");
        return;
    }

    myDisplayElement.innerHTML = ""; // Ryd gammel data

    if (!data) {
        myDisplayElement.innerHTML = `<p>Ingen pollen-data tilgængelig.</p>`;
        return;
    }

    console.log("📌 Opdaterer UI med pollen-data:", data); // Debugging

    // Indlæs gemte pollen-typer fra settings (hvis der er nogen)
    const selectedPollens = JSON.parse(localStorage.getItem("selectedPollens")) || {
        alder_pollen: true,
        birch_pollen: true,
        grass_pollen: true,
        mugwort_pollen: true,
        olive_pollen: true,
        ragweed_pollen: true
    };

    let myCurrentHTML = `<h2>Pollental</h2><div class="pollen-container">`;

    if (selectedPollens.alder_pollen) myCurrentHTML += createPollenCard("El", data.alder_pollen);
    if (selectedPollens.birch_pollen) myCurrentHTML += createPollenCard("Birk", data.birch_pollen);
    if (selectedPollens.grass_pollen) myCurrentHTML += createPollenCard("Græs", data.grass_pollen);
    if (selectedPollens.mugwort_pollen) myCurrentHTML += createPollenCard("Bynke", data.mugwort_pollen);
    if (selectedPollens.olive_pollen) myCurrentHTML += createPollenCard("Oliven", data.olive_pollen);
    if (selectedPollens.ragweed_pollen) myCurrentHTML += createPollenCard("Ambrosie", data.ragweed_pollen);

    myCurrentHTML += `</div>`;
    myDisplayElement.innerHTML = myCurrentHTML;
}

// 📌 Funktion til at oprette et pollen-kort
function createPollenCard(name, value) {
    let displayValue = value !== undefined ? value.toFixed(1) : "0";
    let percentageWidth = Math.min(value * 50, 100); // 📌 Justér barens længde

    return `
        <div class="pollen-card">
            <img src="assets/images/pollen.png" alt="${name}">
            <div class="pollen-info">
                <p>${name}</p>
                <strong>${displayValue} p/m³</strong>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percentageWidth}%;"></div>
                </div>
            </div>
        </div>`;
}

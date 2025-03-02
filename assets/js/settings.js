document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".pollen");

    // Indlæs tidligere gemte valg
    const selectedPollens = JSON.parse(localStorage.getItem("selectedPollens")) || {};

    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectedPollens[checkbox.id] || false;
    });

    // Gem valg i LocalStorage
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            selectedPollens[checkbox.id] = checkbox.checked;
            localStorage.setItem("selectedPollens", JSON.stringify(selectedPollens));
        });
    });
});

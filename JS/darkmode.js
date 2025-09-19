function darkMode(toggleSelector) {
    const toggle = document.querySelector(toggleSelector);

    if (!toggle) return;

    // Load saved preference
    if (localStorage.getItem("darkmode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
    }

    // Listen for toggle changes
    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkmode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkmode", "disabled");
        }
    });
}

window.darkMode = darkMode;

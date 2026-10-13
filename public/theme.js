// Runs before first paint so a saved dark theme doesn't flash light.
try {
    const theme = JSON.parse(localStorage.getItem('sudokushka:theme'));
    if (theme) document.documentElement.dataset.theme = theme;
} catch {}

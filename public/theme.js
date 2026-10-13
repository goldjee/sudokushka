// Runs before first paint: saved choice, else the device theme. Game reads the result back.
try {
    const theme = JSON.parse(localStorage.getItem('sudokushka:theme'));
    document.documentElement.dataset.theme =
        theme ??
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch {}

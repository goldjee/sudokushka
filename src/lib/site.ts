// GitHub Pages serves the app from goldjee.github.io/sudokushka; dev runs at the root.
export const BASE_PATH =
    process.env.NODE_ENV === 'production' ? '/sudokushka' : '';

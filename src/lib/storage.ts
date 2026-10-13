export const KEY = {
    game: 'sudokushka:game',
    records: 'sudokushka:records',
    lang: 'sudokushka:lang',
    theme: 'sudokushka:theme',
};

export function load<V>(key: string): V | null {
    try {
        const s = localStorage.getItem(key);
        return s ? (JSON.parse(s) as V) : null;
    } catch {
        return null;
    }
}

export function save(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage full or blocked: the game still works, it just won't persist.
    }
}

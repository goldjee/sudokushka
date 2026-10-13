// 75_000 → "1:15", 3_725_000 → "1:02:05"
export function formatTime(ms: number) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor(s / 60) % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${h ? `${h}:${pad(m)}` : m}:${pad(s % 60)}`;
}

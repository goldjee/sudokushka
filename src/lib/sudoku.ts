export type Difficulty = 'easy' | 'medium' | 'hard';
export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Target number of given digits. Removal stops earlier if uniqueness would break.
const GIVENS: Record<Difficulty, number> = { easy: 38, medium: 30, hard: 24 };

const box = (i: number) => Math.floor(i / 27) * 3 + Math.floor((i % 9) / 3);

// PEERS[i]: every other cell sharing a row, column or box with cell i.
export const PEERS: number[][] = Array.from({ length: 81 }, (_, i) =>
    Array.from({ length: 81 }, (_, j) => j).filter(
        (j) =>
            j !== i &&
            (Math.floor(j / 9) === Math.floor(i / 9) ||
                j % 9 === i % 9 ||
                box(j) === box(i)),
    ),
);

export const sameUnit = (a: number, b: number) =>
    a === b || PEERS[a].includes(b);

function shuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function candidates(g: number[], i: number): number[] {
    const used = new Set(PEERS[i].map((j) => g[j]));
    return DIGITS.filter((d) => !used.has(d));
}

// Backtracking with fewest-candidates-first. Counts solutions up to `limit`;
// when the limit is reached the grid is left filled with the last solution found.
function solve(g: number[], limit: number, random = false): number {
    let best = -1;
    let bestCands: number[] = [];
    for (let i = 0; i < 81; i++) {
        if (g[i]) continue;
        const c = candidates(g, i);
        if (c.length === 0) return 0;
        if (best < 0 || c.length < bestCands.length) {
            best = i;
            bestCands = c;
            if (c.length === 1) break;
        }
    }
    if (best < 0) return 1;
    let count = 0;
    for (const d of random ? shuffle(bestCands) : bestCands) {
        g[best] = d;
        count += solve(g, limit - count, random);
        if (count >= limit) return count;
    }
    g[best] = 0;
    return count;
}

export const countSolutions = (puzzle: number[]) => solve([...puzzle], 2);

export function generate(difficulty: Difficulty) {
    const solution = new Array<number>(81).fill(0);
    solve(solution, 1, true);
    const puzzle = [...solution];
    let givens = 81;
    for (const i of shuffle([...Array(81).keys()])) {
        if (givens <= GIVENS[difficulty]) break;
        const d = puzzle[i];
        puzzle[i] = 0;
        if (countSolutions(puzzle) === 1) givens--;
        else puzzle[i] = d;
    }
    return { puzzle, solution };
}

// conflicts[i] is true when cell i holds a digit that a peer also holds.
export const conflicts = (cells: number[]) =>
    cells.map((v, i) => v !== 0 && PEERS[i].some((j) => cells[j] === v));

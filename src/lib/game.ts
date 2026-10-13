import { type Difficulty, generate, PEERS } from './sudoku';

type Board = { values: number[]; notes: number[] };

export type Game = Board & {
    difficulty: Difficulty;
    givens: number[]; // printed digits and revealed hints; locked
    solution: number[];
    // values: player's digits, ignored where givens[i] is set
    // notes: pencil marks, bit d set means note d
    history: Board[];
    elapsed: number; // ms of visible play
    hints: number;
    hintAt: number; // elapsed ms when the next hint unlocks
    solved: boolean;
};

export type Records = Partial<
    Record<Difficulty, { ms: number; hints: number }>
>;

const HINT_COOLDOWN = 60_000;
const HINT_GROWTH = 1.5;
const HISTORY_LIMIT = 200;

export function createGame(difficulty: Difficulty): Game {
    const { puzzle, solution } = generate(difficulty);
    return {
        difficulty,
        givens: puzzle,
        solution,
        values: new Array(81).fill(0),
        notes: new Array(81).fill(0),
        history: [],
        elapsed: 0,
        hints: 0,
        hintAt: 0,
        solved: false,
    };
}

// The digit shown in each cell, printed or written by the player.
export const boardCells = (g: Game) => g.givens.map((v, i) => v || g.values[i]);

export const hintWait = (g: Game) => Math.max(0, g.hintAt - g.elapsed);

const editable = (g: Game, cell: number) => !g.solved && !g.givens[cell];

function dropNoteFromPeers(notes: number[], cell: number, digit: number) {
    for (const j of PEERS[cell]) notes[j] &= ~(1 << digit);
}

// Saves the previous board for undo and checks whether the puzzle is solved.
function commit(g: Game, board: Board, extra: Partial<Game> = {}): Game {
    const next: Game = {
        ...g,
        ...extra,
        ...board,
        history: [...g.history, { values: g.values, notes: g.notes }].slice(
            -HISTORY_LIMIT,
        ),
    };
    next.solved = boardCells(next).every((v, i) => v === g.solution[i]);
    return next;
}

// Each function below returns the same game object when the move does nothing.

export function placeDigit(g: Game, cells: number[], digit: number): Game {
    const targets = cells.filter(
        (c) => editable(g, c) && g.values[c] !== digit,
    );
    if (targets.length === 0) return g;
    const values = [...g.values];
    const notes = [...g.notes];
    for (const c of targets) {
        values[c] = digit;
        notes[c] = 0;
        dropNoteFromPeers(notes, c, digit);
    }
    return commit(g, { values, notes });
}

// Adds the note to every cell, or removes it if all of them already have it.
export function toggleNote(g: Game, cells: number[], digit: number): Game {
    const targets = cells.filter((c) => editable(g, c) && !g.values[c]);
    if (targets.length === 0) return g;
    const bit = 1 << digit;
    const remove = targets.every((c) => g.notes[c] & bit);
    const notes = [...g.notes];
    for (const c of targets)
        notes[c] = remove ? notes[c] & ~bit : notes[c] | bit;
    return commit(g, { values: g.values, notes });
}

export function erase(g: Game, cells: number[]): Game {
    const targets = cells.filter(
        (c) => editable(g, c) && (g.values[c] || g.notes[c]),
    );
    if (targets.length === 0) return g;
    const values = [...g.values];
    const notes = [...g.notes];
    for (const c of targets) {
        values[c] = 0;
        notes[c] = 0;
    }
    return commit(g, { values, notes });
}

export function undo(g: Game): Game {
    const last = g.history.at(-1);
    if (!last || g.solved) return g;
    return { ...g, ...last, history: g.history.slice(0, -1) };
}

// Reveals the preferred cell if it is still open, otherwise a random open one.
export function revealHint(
    g: Game,
    preferred: number | null,
    random = Math.random,
): { game: Game; cell: number } | null {
    if (g.solved || hintWait(g) > 0) return null;
    const open = (i: number) => !g.givens[i] && g.values[i] !== g.solution[i];
    const pool = g.solution.map((_, i) => i).filter(open);
    if (pool.length === 0) return null;
    const cell =
        preferred !== null && open(preferred)
            ? preferred
            : pool[Math.floor(random() * pool.length)];
    const digit = g.solution[cell];
    const givens = [...g.givens];
    givens[cell] = digit;
    const notes = [...g.notes];
    notes[cell] = 0;
    dropNoteFromPeers(notes, cell, digit);
    const hints = g.hints + 1;
    const game = commit(
        g,
        { values: g.values, notes },
        {
            givens,
            hints,
            hintAt: g.elapsed + HINT_COOLDOWN * HINT_GROWTH ** (hints - 1),
        },
    );
    return { game, cell };
}

// Returns updated records when the solved game beats the best time, else null.
export function recordFor(records: Records, g: Game): Records | null {
    const best = records[g.difficulty];
    if (best && best.ms <= g.elapsed) return null;
    return { ...records, [g.difficulty]: { ms: g.elapsed, hints: g.hints } };
}

import { expect, test } from 'bun:test';
import {
    createGame,
    erase,
    type Game,
    placeDigit,
    recordFor,
    revealHint,
    toggleNote,
    undo,
} from './game';
import { PEERS } from './sudoku';

const firstOpen = (g: Game) => g.givens.indexOf(0);

test('placing a digit clears that note from peers, undo restores it', () => {
    const g0 = createGame('easy');
    const cell = firstOpen(g0);
    const peer = PEERS[cell].find((j) => !g0.givens[j]) ?? -1;
    const g1 = toggleNote(g0, peer, 4);
    expect(g1.notes[peer]).toBe(1 << 4);
    const g2 = placeDigit(g1, cell, 4);
    expect(g2.values[cell]).toBe(4);
    expect(g2.notes[peer]).toBe(0);
    expect(undo(g2).notes[peer]).toBe(1 << 4);
});

test('given cells and no-op moves leave the game untouched', () => {
    const g = createGame('easy');
    const given = g.givens.findIndex(Boolean);
    expect(placeDigit(g, given, 1)).toBe(g);
    expect(erase(g, firstOpen(g))).toBe(g);
    expect(undo(g)).toBe(g);
});

test('hint cooldown starts at 60s and grows 1.5x', () => {
    let g = createGame('hard');
    const waits: number[] = [];
    for (let n = 0; n < 3; n++) {
        const hint = revealHint(g, null);
        if (!hint) throw new Error('hint expected');
        expect(hint.game.givens[hint.cell]).toBe(g.solution[hint.cell]);
        expect(revealHint(hint.game, null)).toBeNull();
        waits.push(hint.game.hintAt - g.elapsed);
        g = { ...hint.game, elapsed: hint.game.hintAt };
    }
    expect(waits).toEqual([60_000, 90_000, 135_000]);
});

test('filling the solution solves the game and sets a record', () => {
    let g = createGame('medium');
    g.solution.forEach((d, i) => {
        g = placeDigit(g, i, d);
    });
    expect(g.solved).toBe(true);
    const done = { ...g, elapsed: 5000 };
    const records = recordFor({}, done);
    expect(records?.medium).toEqual({ ms: 5000, hints: 0 });
    expect(recordFor(records ?? {}, { ...done, elapsed: 6000 })).toBeNull();
});

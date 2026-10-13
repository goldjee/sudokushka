import { expect, test } from 'bun:test';
import { conflicts, countSolutions, DIFFICULTIES, generate } from './sudoku';

for (const d of DIFFICULTIES) {
    test(`generate ${d}: valid, unique, consistent`, () => {
        const t = performance.now();
        const { puzzle, solution } = generate(d);
        const ms = performance.now() - t;
        expect(solution.every((v) => v >= 1 && v <= 9)).toBe(true);
        expect(conflicts(solution).some(Boolean)).toBe(false);
        expect(puzzle.every((v, i) => v === 0 || v === solution[i])).toBe(true);
        expect(countSolutions(puzzle)).toBe(1);
        console.log(
            d,
            'givens:',
            puzzle.filter(Boolean).length,
            `${ms.toFixed(0)}ms`,
        );
    });
}

test('conflicts marks both duplicates in a row', () => {
    const cells = new Array(81).fill(0);
    cells[0] = 5;
    cells[8] = 5;
    cells[10] = 3;
    const c = conflicts(cells);
    expect([c[0], c[8], c[10]]).toEqual([true, true, false]);
});

import { type CSSProperties, useState } from 'react';
import { conflicts, DIGITS, sameUnit } from '@/lib/sudoku';

const CELLS = Array.from({ length: 81 }, (_, i) => i);

type Props = {
    cells: number[];
    givens: number[];
    notes: number[];
    wrong: boolean[];
    selected: number[];
    onSelect: (cell: number, add: boolean) => void;
};

type Ghost = {
    id: number;
    cells: number[];
    notes: number[];
    erased: boolean[];
    bad: boolean[]; // keeps a wrong digit red while it is being erased
    first: number; // smallest row+col among erased cells, so the stagger starts at 0
};

const diagonal = (i: number) => (i % 9) + Math.floor(i / 9);

export function Board({
    cells,
    givens,
    notes,
    wrong,
    selected,
    onSelect,
}: Props) {
    // Erased content leaves the DOM at once, so keep a snapshot to play the erase animation over.
    const [prev, setPrev] = useState({ cells, notes });
    const [ghost, setGhost] = useState<Ghost | null>(null);
    // cells is a fresh array on every timer tick, so compare by value
    if (notes !== prev.notes || cells.some((v, i) => v !== prev.cells[i])) {
        const erased = cells.map(
            (v, i) =>
                !v && !notes[i] && (prev.cells[i] > 0 || prev.notes[i] > 0),
        );
        setPrev({ cells, notes });
        if (erased.some(Boolean))
            setGhost({
                ...prev,
                id: (ghost?.id ?? 0) + 1,
                erased,
                bad: conflicts(prev.cells),
                first: Math.min(
                    ...CELLS.filter((i) => erased[i]).map(diagonal),
                ),
            });
    }

    const bad = conflicts(cells);
    const primary = selected.at(-1);
    const selectedValue = primary === undefined ? 0 : cells[primary];

    return (
        <div className='board'>
            {CELLS.map((i) => {
                const value = cells[i];
                const col = i % 9;
                const row = Math.floor(i / 9);
                const className = [
                    'cell',
                    givens[i] ? 'given' : 'pen',
                    col === 2 || col === 5 ? 'br' : '',
                    row === 2 || row === 5 ? 'bb' : '',
                    primary !== undefined && sameUnit(primary, i) ? 'area' : '',
                    selectedValue && value === selectedValue ? 'same' : '',
                    selected.includes(i) ? 'sel' : '',
                    bad[i] || wrong[i] ? 'bad' : '',
                ].join(' ');
                return (
                    <button
                        type='button'
                        key={i}
                        className={className}
                        aria-label={`${row + 1}-${col + 1}${value ? `: ${value}` : ''}`}
                        onClick={(e) => onSelect(i, e.shiftKey)}
                    >
                        {value || (notes[i] > 0 && <Notes mask={notes[i]} />)}
                        {ghost?.erased[i] && (
                            <Erased
                                key={ghost.id}
                                cell={i}
                                value={ghost.cells[i]}
                                mask={ghost.notes[i]}
                                bad={ghost.bad[i]}
                                delay={(diagonal(i) - ghost.first) * 25}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function Notes({ mask }: { mask: number }) {
    return (
        <span className='notes'>
            {DIGITS.map((d) => (
                <span key={d}>{mask & (1 << d) ? d : ''}</span>
            ))}
        </span>
    );
}

type ErasedProps = {
    cell: number;
    value: number;
    mask: number;
    bad: boolean;
    delay: number;
};

// SVG so a zigzag brush stroke can be drawn into a mask: the content vanishes where the stroke passes.
function Erased({ cell, value, mask, bad, delay }: ErasedProps) {
    const id = `erase-${cell}`;
    return (
        <svg
            className={`erased ${bad ? 'bad' : ''}`}
            viewBox='0 0 100 100'
            aria-hidden='true'
            style={{ '--delay': `${delay}ms` } as CSSProperties}
        >
            <mask id={id}>
                <rect width='100' height='100' fill='white' />
                <path
                    d='M10 16 L90 24 L10 36 L90 46 L10 58 L90 68 L10 80 L88 90'
                    pathLength={1}
                />
            </mask>
            <g mask={`url(#${id})`}>
                {value ? (
                    <text x='50' y='50' fontSize='76'>
                        {value}
                    </text>
                ) : (
                    <g className='ghost-notes'>
                        {DIGITS.filter((d) => mask & (1 << d)).map((d) => (
                            <text
                                key={d}
                                x={18 + ((d - 1) % 3) * 32}
                                y={18 + Math.floor((d - 1) / 3) * 32}
                                fontSize='33'
                            >
                                {d}
                            </text>
                        ))}
                    </g>
                )}
            </g>
        </svg>
    );
}

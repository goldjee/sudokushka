import { conflicts, DIGITS, sameUnit } from '@/lib/sudoku';

const CELLS = Array.from({ length: 81 }, (_, i) => i);

type Props = {
    cells: number[];
    givens: number[];
    notes: number[];
    selected: number[];
    onSelect: (cell: number, add: boolean) => void;
};

export function Board({ cells, givens, notes, selected, onSelect }: Props) {
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
                    bad[i] ? 'bad' : '',
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

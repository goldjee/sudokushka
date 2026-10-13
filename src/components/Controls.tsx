import { formatTime } from '@/lib/format';
import type { Strings } from '@/lib/i18n';
import { DIGITS } from '@/lib/sudoku';

type Props = {
    t: Strings;
    cells: number[];
    pencil: boolean;
    canUndo: boolean;
    hintWait: number;
    onDigit: (digit: number) => void;
    onUndo: () => void;
    onErase: () => void;
    onTogglePencil: () => void;
    onHint: () => void;
};

export function Controls({
    t,
    cells,
    pencil,
    canUndo,
    hintWait,
    onDigit,
    onUndo,
    onErase,
    onTogglePencil,
    onHint,
}: Props) {
    return (
        <div className='controls'>
            <div className='pad'>
                {DIGITS.map((d) => (
                    <button
                        type='button'
                        key={d}
                        className={`btn digit ${pencil ? 'pencil' : ''}`}
                        disabled={cells.filter((v) => v === d).length >= 9}
                        onClick={() => onDigit(d)}
                    >
                        {d}
                    </button>
                ))}
            </div>
            <div className='tools'>
                <button
                    type='button'
                    className='btn'
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    {t.undo}
                </button>
                <button type='button' className='btn' onClick={onErase}>
                    {t.erase}
                </button>
                <button
                    type='button'
                    className='btn'
                    aria-pressed={pencil}
                    onClick={onTogglePencil}
                >
                    ✎ {t.pencil}
                </button>
                <button
                    type='button'
                    className='btn'
                    onClick={onHint}
                    disabled={hintWait > 0}
                >
                    {t.hint}
                    {hintWait > 0 && ` ${formatTime(hintWait + 999)}`}
                </button>
            </div>
        </div>
    );
}

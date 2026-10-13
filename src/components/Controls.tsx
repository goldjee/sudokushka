import { formatTime } from '@/lib/format';
import type { Strings } from '@/lib/i18n';
import { DIGITS } from '@/lib/sudoku';

// Line icons in the same stroke style as the theme toggle (.icon).
const ICONS = {
    pencil: 'M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8L2 21.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5zM15 5l4 4',
    erase: 'M7 21l-4.3-4.3a2.4 2.4 0 0 1 0-3.4l9.6-9.6a2.4 2.4 0 0 1 3.4 0l5.6 5.6a2.4 2.4 0 0 1 0 3.4L13 21M22 21H7M5 11l9 9',
    undo: 'M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
    hint: 'M15 14c.2-1 .7-1.7 1.5-2.5A5 5 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4',
    reset: 'M3 12a9 9 0 1 0 2.6-6.4L3 8M3 3v5h5',
};

const Icon = ({ d }: { d: string }) => (
    <svg className='icon' viewBox='0 0 24 24' aria-hidden='true'>
        <path d={d} />
    </svg>
);

type Props = {
    t: Strings;
    cells: number[];
    pencil: boolean;
    canUndo: boolean;
    hintWait: number;
    onDigit: (digit: number) => void;
    onUndo: () => void;
    onErase: () => void;
    onReset: () => void;
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
    onReset,
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
                    aria-pressed={pencil}
                    onClick={onTogglePencil}
                >
                    <Icon d={ICONS.pencil} />
                    {t.pencil}
                </button>
                <button type='button' className='btn' onClick={onErase}>
                    <Icon d={ICONS.erase} />
                    {t.erase}
                </button>
                <button
                    type='button'
                    className='btn'
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    <Icon d={ICONS.undo} />
                    {t.undo}
                </button>
                <button
                    type='button'
                    className='btn'
                    aria-label={t.hint}
                    onClick={onHint}
                    disabled={hintWait > 0}
                >
                    <Icon d={ICONS.hint} />
                    {/* Time replaces the label so the button never wraps and shifts the layout */}
                    {hintWait > 0 ? formatTime(hintWait + 999) : t.hint}
                </button>
                <button type='button' className='btn wide' onClick={onReset}>
                    <Icon d={ICONS.reset} />
                    {t.reset}
                </button>
            </div>
        </div>
    );
}

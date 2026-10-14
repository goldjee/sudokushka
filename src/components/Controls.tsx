import { formatTime } from '@/lib/format';
import type { Strings } from '@/lib/i18n';
import { DIGITS } from '@/lib/sudoku';

// Line icons in the same stroke style as the theme toggle (.icon).
const ICONS = {
    pencil: 'M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8L2 21.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5zM15 5l4 4',
    erase: 'M7 21l-4.3-4.3a2.4 2.4 0 0 1 0-3.4l9.6-9.6a2.4 2.4 0 0 1 3.4 0l5.6 5.6a2.4 2.4 0 0 1 0 3.4L13 21M22 21H7M5 11l9 9',
    undo: 'M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
    // magic wand: the digit appears by itself
    hint: 'M21.6 3.6l-1.2-1.2a1.2 1.2 0 0 0-1.7 0L2.4 18.6a1.2 1.2 0 0 0 0 1.7l1.2 1.2a1.2 1.2 0 0 0 1.7 0L21.6 5.4a1.2 1.2 0 0 0 0-1.7M14 7l3 3M5 6v4M19 14v4M10 2v2M7 8H3M21 16h-4M11 3H9',
    // magnifier with a cross: looks for wrong digits
    check: 'M13.5 8.5l-5 5M8.5 8.5l5 5M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
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
    checkWait: number;
    onDigit: (digit: number) => void;
    onUndo: () => void;
    onErase: () => void;
    onReset: () => void;
    onTogglePencil: () => void;
    onHint: () => void;
    onCheck: () => void;
};

export function Controls({
    t,
    cells,
    pencil,
    canUndo,
    hintWait,
    checkWait,
    onDigit,
    onUndo,
    onErase,
    onReset,
    onTogglePencil,
    onHint,
    onCheck,
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
                <button
                    type='button'
                    className='btn pencil-key'
                    aria-pressed={pencil}
                    onClick={onTogglePencil}
                >
                    <Icon d={ICONS.pencil} />
                    <span>{t.pencil}</span>
                </button>
            </div>
            <div className='tools'>
                <button
                    type='button'
                    className='btn'
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    <Icon d={ICONS.undo} />
                    <span>{t.undo}</span>
                </button>
                <button type='button' className='btn' onClick={onErase}>
                    <Icon d={ICONS.erase} />
                    <span>{t.erase}</span>
                </button>
                <button type='button' className='btn' onClick={onReset}>
                    <Icon d={ICONS.reset} />
                    <span>{t.reset}</span>
                </button>
            </div>
            <div className='tools'>
                <button
                    type='button'
                    className='btn'
                    aria-label={t.hint}
                    onClick={onHint}
                    disabled={hintWait > 0}
                >
                    <Icon d={ICONS.hint} />
                    {/* Time replaces the label so the button never wraps and shifts the layout */}
                    <span>
                        {hintWait > 0 ? formatTime(hintWait + 999) : t.hint}
                    </span>
                </button>
                <button
                    type='button'
                    className='btn'
                    aria-label={t.check}
                    onClick={onCheck}
                    disabled={checkWait > 0}
                >
                    <Icon d={ICONS.check} />
                    <span>
                        {checkWait > 0 ? formatTime(checkWait + 999) : t.check}
                    </span>
                </button>
            </div>
        </div>
    );
}

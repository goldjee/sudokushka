import { type ReactNode, useId, useRef, useState } from 'react';
import { formatTime } from '@/lib/format';
import type { Records } from '@/lib/game';
import type { Strings } from '@/lib/i18n';
import { DIFFICULTIES, type Difficulty } from '@/lib/sudoku';

type DialogProps = {
    open: boolean;
    title: string;
    closeLabel?: string;
    onClose?: () => void; // shows a close button in the corner
    children: ReactNode;
};

// Stays mounted after `open` turns false until the closing animation ends.
function Dialog({ open, title, closeLabel, onClose, children }: DialogProps) {
    const titleId = useId();
    const [shown, setShown] = useState(open);
    if (open && !shown) setShown(true);
    // Freeze the content while closing, so it doesn't change under the fade (e.g. the loss warning after a new game).
    const content = useRef(children);
    if (open) content.current = children;
    if (!shown) return null;
    return (
        <div
            className={`overlay ${open ? '' : 'closing'}`}
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            onAnimationEnd={(e) =>
                !open && e.target === e.currentTarget && setShown(false)
            }
        >
            <div className='dialog'>
                <h2 id={titleId}>{title}</h2>
                {content.current}
                {onClose && (
                    <button
                        type='button'
                        className='btn close'
                        aria-label={closeLabel}
                        onClick={onClose}
                    >
                        <svg
                            className='icon'
                            viewBox='0 0 24 24'
                            aria-hidden='true'
                        >
                            <path d='M6 6l12 12M18 6L6 18' />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

type NewGameProps = {
    open: boolean;
    t: Strings;
    records: Records;
    warnLoss: boolean;
    onPick: (difficulty: Difficulty) => void;
    onCancel?: () => void; // no close button when there is no game to return to
};

export function NewGameDialog({
    open,
    t,
    records,
    warnLoss,
    onPick,
    onCancel,
}: NewGameProps) {
    return (
        <Dialog
            open={open}
            title={t.chooseLevel}
            closeLabel={t.cancel}
            onClose={onCancel}
        >
            {warnLoss && <p className='warn'>{t.loseWarning}</p>}
            {DIFFICULTIES.map((d) => {
                const record = records[d];
                return (
                    <button
                        type='button'
                        key={d}
                        className='btn big'
                        onClick={() => onPick(d)}
                    >
                        {t[d]}
                        {record && (
                            <small>
                                {t.record} {formatTime(record.ms)}
                                {record.hints > 0 && ` (${t.withHints})`}
                            </small>
                        )}
                    </button>
                );
            })}
        </Dialog>
    );
}

type WinProps = {
    open: boolean;
    t: Strings;
    elapsed: number;
    hints: number;
    newRecord: boolean;
    onNewGame: () => void;
};

export function WinDialog({
    open,
    t,
    elapsed,
    hints,
    newRecord,
    onNewGame,
}: WinProps) {
    return (
        <Dialog open={open} title={t.solved}>
            <p>
                {t.time}: {formatTime(elapsed)}
                {hints > 0 && ` (${t.withHints})`}
            </p>
            {newRecord && <p className='record'>{t.newRecord}</p>}
            <button type='button' className='btn big' onClick={onNewGame}>
                {t.newGame}
            </button>
        </Dialog>
    );
}

type ConfirmProps = {
    open: boolean;
    t: Strings;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ResetDialog({ open, t, onConfirm, onCancel }: ConfirmProps) {
    return (
        <Dialog
            open={open}
            title={t.reset}
            closeLabel={t.cancel}
            onClose={onCancel}
        >
            <p className='warn'>{t.resetConfirm}</p>
            <button type='button' className='btn big' onClick={onConfirm}>
                {t.reset}
            </button>
            <button type='button' className='btn big cancel' onClick={onCancel}>
                {t.cancel}
            </button>
        </Dialog>
    );
}

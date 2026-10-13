import { type ReactNode, useId } from 'react';
import { formatTime } from '@/lib/format';
import type { Records } from '@/lib/game';
import type { Strings } from '@/lib/i18n';
import { DIFFICULTIES, type Difficulty } from '@/lib/sudoku';

function Dialog({ title, children }: { title: string; children: ReactNode }) {
    const titleId = useId();
    return (
        <div
            className='overlay'
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
        >
            <div className='dialog'>
                <h2 id={titleId}>{title}</h2>
                {children}
            </div>
        </div>
    );
}

type NewGameProps = {
    t: Strings;
    records: Records;
    warnLoss: boolean;
    onPick: (difficulty: Difficulty) => void;
    onCancel?: () => void; // no cancel when there is no game to return to
};

export function NewGameDialog({
    t,
    records,
    warnLoss,
    onPick,
    onCancel,
}: NewGameProps) {
    return (
        <Dialog title={t.chooseLevel}>
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
            {onCancel && (
                <button type='button' className='btn' onClick={onCancel}>
                    {t.cancel}
                </button>
            )}
        </Dialog>
    );
}

type WinProps = {
    t: Strings;
    elapsed: number;
    hints: number;
    newRecord: boolean;
    onNewGame: () => void;
};

export function WinDialog({
    t,
    elapsed,
    hints,
    newRecord,
    onNewGame,
}: WinProps) {
    return (
        <Dialog title={t.solved}>
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

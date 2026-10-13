import { formatTime } from '@/lib/format';
import type { Strings } from '@/lib/i18n';
import type { Difficulty } from '@/lib/sudoku';

export type Theme = 'light' | 'dark';

type Props = {
    t: Strings;
    difficulty: Difficulty;
    elapsed: number;
    theme: Theme;
    onToggleLang: () => void;
    onToggleTheme: () => void;
    onNewGame: () => void;
};

export function Header({
    t,
    difficulty,
    elapsed,
    theme,
    onToggleLang,
    onToggleTheme,
    onNewGame,
}: Props) {
    return (
        <header className='top'>
            <h1>{t.title}</h1>
            <div className='status'>
                <span>{t[difficulty]}</span>
                <span className='timer'>{formatTime(elapsed)}</span>
            </div>
            <div className='actions'>
                <button
                    type='button'
                    className='btn small'
                    onClick={onToggleLang}
                >
                    {t.otherLang}
                </button>
                <button
                    type='button'
                    className='btn small'
                    aria-label={theme === 'light' ? t.darkTheme : t.lightTheme}
                    onClick={onToggleTheme}
                >
                    {theme === 'light' ? '☾' : '☀'}
                </button>
                <button type='button' className='btn small' onClick={onNewGame}>
                    {t.newGame}
                </button>
            </div>
        </header>
    );
}

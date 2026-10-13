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
                    <svg
                        className='icon'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                    >
                        {theme === 'light' ? (
                            <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />
                        ) : (
                            <>
                                <circle cx='12' cy='12' r='4.5' />
                                <path d='M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8' />
                            </>
                        )}
                    </svg>
                </button>
                <button type='button' className='btn small' onClick={onNewGame}>
                    {t.newGame}
                </button>
            </div>
        </header>
    );
}

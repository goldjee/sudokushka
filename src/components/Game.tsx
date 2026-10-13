'use client';

import { useEffect, useRef, useState } from 'react';
import {
    boardCells,
    createGame,
    erase,
    type Game as GameState,
    hintWait,
    placeDigit,
    type Records,
    recordFor,
    reset,
    revealHint,
    toggleNote,
    undo,
} from '@/lib/game';
import { type Lang, T } from '@/lib/i18n';
import { KEY, load, save } from '@/lib/storage';
import type { Difficulty } from '@/lib/sudoku';
import { Board } from './Board';
import { Controls } from './Controls';
import { NewGameDialog, ResetDialog, WinDialog } from './Dialogs';
import { Header, type Theme } from './Header';

export default function Game() {
    const [ready, setReady] = useState(false);
    const [game, setGame] = useState<GameState | null>(null);
    const [records, setRecords] = useState<Records>({});
    const [lang, setLang] = useState<Lang>('ru');
    const [theme, setTheme] = useState<Theme>('light');
    const [selected, setSelected] = useState<number[]>([]);
    const [pencil, setPencil] = useState(false);
    const [menu, setMenu] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const [newRecord, setNewRecord] = useState(false);
    const onKey = useRef((_: KeyboardEvent) => {});

    useEffect(() => {
        const saved = load<GameState>(KEY.game);
        setGame(saved);
        setMenu(!saved);
        setRecords(load<Records>(KEY.records) ?? {});
        setLang(
            load<Lang>(KEY.lang) ??
                (navigator.language.startsWith('ru') ? 'ru' : 'en'),
        );
        setTheme(document.documentElement.dataset.theme as Theme);
        setReady(true);
    }, []);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => onKey.current(e);
        document.addEventListener('keydown', listener);
        return () => document.removeEventListener('keydown', listener);
    }, []);

    useEffect(() => {
        if (game) save(KEY.game, game);
    }, [game]);

    useEffect(() => {
        if (!ready) return;
        document.documentElement.dataset.theme = theme;
    }, [ready, theme]);

    useEffect(() => {
        if (!ready) return;
        document.documentElement.lang = lang;
        document.title = T[lang].title;
        save(KEY.lang, lang);
    }, [ready, lang]);

    const running = !!game && !game.solved && !menu;
    useEffect(() => {
        if (!running) return;
        let last = Date.now();
        const id = setInterval(() => {
            const now = Date.now();
            // Cap the step so time spent asleep or in the background never counts.
            const step = Math.min(now - last, 1500);
            last = now;
            if (document.visibilityState === 'visible')
                setGame((g) => g && { ...g, elapsed: g.elapsed + step });
        }, 1000);
        return () => clearInterval(id);
    }, [running]);

    if (!ready) return null;
    const t = T[lang];

    function startGame(difficulty: Difficulty) {
        setGame(createGame(difficulty));
        setSelected([]);
        setPencil(false);
        setNewRecord(false);
        setMenu(false);
    }

    const newGameDialog = (
        <NewGameDialog
            t={t}
            records={records}
            warnLoss={!!game && !game.solved && game.history.length > 0}
            onPick={startGame}
            onCancel={game ? () => setMenu(false) : undefined}
        />
    );

    if (!game) return menu && newGameDialog;

    function play(next: GameState) {
        if (next === game) return;
        if (next.solved) {
            const updated = recordFor(records, next);
            if (updated) {
                setRecords(updated);
                save(KEY.records, updated);
            }
            setNewRecord(updated !== null);
            setSelected([]);
        }
        setGame(next);
    }

    function onDigit(digit: number) {
        if (!game) return;
        play(
            pencil
                ? toggleNote(game, selected, digit)
                : placeDigit(game, selected, digit),
        );
    }

    function onHint() {
        const hint = game && revealHint(game, selected.at(-1) ?? null);
        if (!hint) return;
        setSelected([hint.cell]);
        play(hint.game);
    }

    function onSelect(cell: number, add: boolean) {
        if (!add) setSelected([cell]);
        else if (selected.includes(cell))
            setSelected(selected.filter((c) => c !== cell));
        else setSelected([...selected, cell]);
    }

    const onErase = () => game && play(erase(game, selected));

    onKey.current = (e) => {
        if (menu || confirmReset || e.ctrlKey || e.metaKey || e.altKey) return;
        // e.code, not e.key: Shift held from multi-select turns 1 into '!'.
        const digit = /^(?:Digit|Numpad)([1-9])$/.exec(e.code)?.[1];
        if (digit) onDigit(Number(digit));
        else if (e.key === 'Backspace' || e.key === 'Delete') onErase();
    };

    const cells = boardCells(game);

    return (
        <main className='app'>
            <Header
                t={t}
                difficulty={game.difficulty}
                elapsed={game.elapsed}
                theme={theme}
                onToggleLang={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                onToggleTheme={() => {
                    const next = theme === 'light' ? 'dark' : 'light';
                    setTheme(next);
                    // Saved only on an explicit choice, so untouched devices keep following the system.
                    save(KEY.theme, next);
                }}
                onNewGame={() => setMenu(true)}
            />
            <Board
                cells={cells}
                givens={game.givens}
                notes={game.notes}
                selected={selected}
                onSelect={onSelect}
            />
            <Controls
                t={t}
                cells={cells}
                pencil={pencil}
                canUndo={game.history.length > 0 && !game.solved}
                hintWait={hintWait(game)}
                onDigit={onDigit}
                onUndo={() => play(undo(game))}
                onErase={onErase}
                onReset={() => setConfirmReset(true)}
                onTogglePencil={() => setPencil(!pencil)}
                onHint={onHint}
            />
            {menu && newGameDialog}
            {confirmReset && (
                <ResetDialog
                    t={t}
                    onConfirm={() => {
                        play(reset(game));
                        setConfirmReset(false);
                    }}
                    onCancel={() => setConfirmReset(false)}
                />
            )}
            {game.solved && !menu && (
                <WinDialog
                    t={t}
                    elapsed={game.elapsed}
                    hints={game.hints}
                    newRecord={newRecord}
                    onNewGame={() => setMenu(true)}
                />
            )}
        </main>
    );
}

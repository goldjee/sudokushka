import type { Difficulty } from './sudoku';

export type Lang = 'ru' | 'en';

export type Strings = Record<Difficulty, string> & {
    title: string;
    newGame: string;
    chooseLevel: string;
    loseWarning: string;
    cancel: string;
    record: string;
    withHints: string;
    solved: string;
    time: string;
    newRecord: string;
    undo: string;
    erase: string;
    reset: string;
    resetConfirm: string;
    pencil: string;
    hint: string;
    darkTheme: string;
    lightTheme: string;
    otherLang: string;
};

export const T: Record<Lang, Strings> = {
    ru: {
        title: 'Судокушка',
        easy: 'Лёгкий',
        medium: 'Средний',
        hard: 'Трудный',
        newGame: 'Новая игра',
        chooseLevel: 'Выберите сложность',
        loseWarning: 'Текущая игра будет потеряна',
        cancel: 'Отмена',
        record: 'рекорд',
        withHints: 'с подсказками',
        solved: 'Решено!',
        time: 'Время',
        newRecord: 'Новый рекорд!',
        undo: 'Отменить',
        erase: 'Стереть',
        reset: 'Сбросить доску',
        resetConfirm: 'Стереть все свои цифры и заметки карандашом?',
        pencil: 'Карандаш',
        hint: 'Подсказка',
        darkTheme: 'Тёмная тема',
        lightTheme: 'Светлая тема',
        otherLang: 'EN',
    },
    en: {
        title: 'Sudokushka',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        newGame: 'New game',
        chooseLevel: 'Choose difficulty',
        loseWarning: 'The current game will be lost',
        cancel: 'Cancel',
        record: 'best',
        withHints: 'with hints',
        solved: 'Solved!',
        time: 'Time',
        newRecord: 'New record!',
        undo: 'Undo',
        erase: 'Erase',
        reset: 'Reset board',
        resetConfirm: 'Erase all your digits and pencil notes?',
        pencil: 'Pencil',
        hint: 'Hint',
        darkTheme: 'Dark theme',
        lightTheme: 'Light theme',
        otherLang: 'RU',
    },
};

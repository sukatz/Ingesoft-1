import React, { useState, useEffect, useRef } from 'react';
import styles from './Board.module.css';

const Board = ({ checkWord, enemyColors, wordLength }) => {
    const maxAttempts = 6;
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [inputWords, setInputWords] = useState(Array(maxAttempts).fill(""));
    const [cursorPosition, setCursorPosition] = useState(0);
    const [isWordComplete, setIsWordComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [playerAttempts, setPlayerAttempts] = useState([]);

    // 🔹 Ref para el contenedor principal
    const boardRef = useRef(null);

    // 🔹 Enfocar automáticamente el tablero al cargar
    useEffect(() => {
        if (boardRef.current) {
            boardRef.current.focus();
        }
    }, []);

    const handleKeyPress = (event) => {
        const rowIndex = currentAttempt;
        if (rowIndex >= maxAttempts) return;

        let newWords = [...inputWords];
        let currentWord = newWords[rowIndex] || "";

        while (currentWord.length < wordLength) {
            currentWord += " ";
        }
        newWords[rowIndex] = currentWord;

        if (event.key === 'Backspace') {
            if (isWordComplete) {
                newWords[rowIndex] = currentWord.slice(0, wordLength - 1) + " ";
                setIsWordComplete(false);
                setCursorPosition(wordLength - 1);
                setIsEditing(true);
            } else if (cursorPosition > 0) {
                const newWord =
                    currentWord.slice(0, cursorPosition - 1) +
                    " " +
                    currentWord.slice(cursorPosition);
                newWords[rowIndex] = newWord;
                setCursorPosition(prev => prev - 1);
                setIsEditing(true);
            }
        } else if (/^[a-zA-Z]$/.test(event.key) && cursorPosition < wordLength && (!isWordComplete)) {
            const newWord =
                currentWord.slice(0, cursorPosition) +
                event.key.toUpperCase() +
                currentWord.slice(cursorPosition + 1);
            newWords[rowIndex] = newWord;

            if (cursorPosition === wordLength - 1) {
                setIsWordComplete(true);
                setIsEditing(false);
            } else {
                setCursorPosition(prev => prev + 1);
            }
        } else if (event.key === 'Enter') {
            const trimmedWord = currentWord.trim();
            if (trimmedWord.length === wordLength) {
                const colors = checkWord(trimmedWord);
                const newAttempts = [...playerAttempts, {
                    word: trimmedWord,
                    colors: colors
                }];

                setPlayerAttempts(newAttempts);
                setCurrentAttempt(prev => Math.min(prev + 1, maxAttempts));
                setCursorPosition(0);
                setIsWordComplete(false);
                setIsEditing(true);
            }
        }

        setInputWords(newWords);
    };

    const getBackgroundClass = (playerCode, enemyCode) => {
        if (playerCode !== null && playerCode !== undefined) {
            switch (playerCode) {
                case 0: return styles.gray;
                case 1: return styles.yellow;
                case 2: return styles.green;
                default: return styles.empty;
            }
        }
        if (enemyCode !== null && enemyCode !== undefined) {
            switch (enemyCode) {
                case 0: return styles.enemyGray;
                case 1: return styles.enemyYellow;
                case 2: return styles.enemyGreen;
                default: return styles.empty;
            }
        }
        return styles.empty;
    };

    const renderRow = (rowIndex) => {
        if (playerAttempts[rowIndex]) {
            const { word, colors: playerColors } = playerAttempts[rowIndex];
            const enemyColorsForRow = enemyColors ? enemyColors[rowIndex] : null;

            return (
                <div className={styles.row} key={`row-${rowIndex}`}>
                    {Array.from({ length: wordLength }).map((_, colIndex) => {
                        const letter = word[colIndex] || '';
                        const playerCode = playerColors[colIndex];

                        let colorClass = styles.empty;

                        if (playerCode === 0 || playerCode === 1 || playerCode === 2) {
                            if (playerCode === 0) colorClass = styles.gray;
                            else if (playerCode === 1) colorClass = styles.yellow;
                            else if (playerCode === 2) colorClass = styles.green;
                        } else if (enemyColorsForRow && enemyColorsForRow[colIndex] !== null) {
                            const enemyCode = enemyColorsForRow[colIndex];
                            if (enemyCode === 0) colorClass = styles.enemyGray;
                            else if (enemyCode === 1) colorClass = styles.enemyYellow;
                            else if (enemyCode === 2) colorClass = styles.enemyGreen;
                        }

                        return (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`${styles.cell} ${colorClass}`}
                            >
                                {letter}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className={styles.row} key={`row-${rowIndex}`}>
                {Array.from({ length: wordLength }).map((_, colIndex) => {
                    const letter = inputWords[rowIndex][colIndex] || '';
                    const isActive = rowIndex === currentAttempt;
                    const isCursor = isActive && colIndex === cursorPosition && isEditing;
                    const enemyStatus = enemyColors[rowIndex]?.[colIndex];

                    return (
                        <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            className={`${styles.cell} ${isActive ? styles.active : ''} ${isCursor ? styles.cursor : ''} ${getBackgroundClass(null, enemyStatus)}`}
                            onClick={() => setCursorPosition(colIndex)}
                        >
                            {letter}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div 
            ref={boardRef} // 🔹 Asignamos el ref al contenedor
            className={styles.wordleContainer} 
            tabIndex={0} 
            onKeyDown={handleKeyPress}
        >
            <h2 className={styles.title}>¡Adivina la palabra!</h2>
            <div className={styles.board}>
                {Array.from({ length: maxAttempts }).map((_, rowIndex) => renderRow(rowIndex))}
            </div>
        </div>
    );
};

export default Board;

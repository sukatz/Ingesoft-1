import React, { useState, useEffect, useRef } from 'react';
import styles from './Board.module.css';

const Board = ({ checkWord, enemyColors, wordLength, setPlayerAttempts, setBoardActions }) => {
    const maxAttempts = 6;
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [inputWords, setInputWords] = useState(Array(maxAttempts).fill(""));
    const [cursorPosition, setCursorPosition] = useState(0);
    const [isWordComplete, setIsWordComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [playerAttempts, setPlayerAttemptsLocal] = useState([]);
    // Agregar un estado explícito para la celda seleccionada
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

    const boardRef = useRef(null);

    // Exponer las funciones para que el teclado pueda usarlas
    useEffect(() => {
        if (setBoardActions) {
            setBoardActions({
                addLetter: (letter) => handleLetterInput(letter),
                backspace: () => handleBackspace(),
                enter: () => handleEnter()
            });
        }
    }, [inputWords, cursorPosition, isWordComplete, currentAttempt]);

    useEffect(() => {
        if (boardRef.current) {
            boardRef.current.focus();
        }
        // Actualizar selectedCell cuando cambia el currentAttempt o cursorPosition
        setSelectedCell({ row: currentAttempt, col: cursorPosition });
    }, [currentAttempt, cursorPosition]);

    // Funciones para manejar el input
    const handleLetterInput = (letter) => {
        if (currentAttempt >= maxAttempts) return;
        if (isWordComplete) return;
        if (cursorPosition >= wordLength) return;

        let newWords = [...inputWords];
        let currentWord = newWords[currentAttempt] || "";

        while (currentWord.length < wordLength) {
            currentWord += " ";
        }

        const newWord =
            currentWord.slice(0, cursorPosition) +
            letter.toUpperCase() +
            currentWord.slice(cursorPosition + 1);

        newWords[currentAttempt] = newWord;
        setInputWords(newWords);

        if (cursorPosition === wordLength - 1) {
            setIsWordComplete(true);
            setIsEditing(false);
        } else {
            setCursorPosition(prev => prev + 1);
        }
    };

    const handleBackspace = () => {
        if (currentAttempt >= maxAttempts) return;

        let newWords = [...inputWords];
        let currentWord = newWords[currentAttempt] || "";

        while (currentWord.length < wordLength) {
            currentWord += " ";
        }

        if (isWordComplete) {
            newWords[currentAttempt] = currentWord.slice(0, wordLength - 1) + " ";
            setIsWordComplete(false);
            setCursorPosition(wordLength - 1);
            setIsEditing(true);
        } else if (cursorPosition > 0) {
            const newWord =
                currentWord.slice(0, cursorPosition - 1) +
                " " +
                currentWord.slice(cursorPosition);
            newWords[currentAttempt] = newWord;
            setCursorPosition(prev => prev - 1);
            setIsEditing(true);
        }

        setInputWords(newWords);
    };

    const handleEnter = () => {
        if (currentAttempt >= maxAttempts) return;

        const currentWord = inputWords[currentAttempt] || "";
        const trimmedWord = currentWord.trim();
        
        if (trimmedWord.length === wordLength) {
            const colors = checkWord(trimmedWord);
            const newAttempts = [...playerAttempts, {
                word: trimmedWord,
                colors: colors
            }];

            setPlayerAttemptsLocal(newAttempts);
            setPlayerAttempts(newAttempts);

            setCurrentAttempt(prev => Math.min(prev + 1, maxAttempts));
            setCursorPosition(0);
            setIsWordComplete(false);
            setIsEditing(true);
        }
    };

    const handleKeyPress = (event) => {
        if (/^[a-zA-Z]$/.test(event.key)) {
            handleLetterInput(event.key);
        } else if (event.key === 'Backspace') {
            handleBackspace();
        } else if (event.key === 'Enter') {
            handleEnter();
        } else if (event.key === 'ArrowLeft' && cursorPosition > 0) {
            setCursorPosition(prev => prev - 1);
        } else if (event.key === 'ArrowRight' && cursorPosition < wordLength - 1) {
            setCursorPosition(prev => prev + 1);
        }
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
                    // Usar el estado selectedCell para determinar si la celda está seleccionada
                    const isSelected = isActive && selectedCell.row === rowIndex && selectedCell.col === colIndex;
                    const enemyStatus = enemyColors[rowIndex]?.[colIndex];

                    return (
                        <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            className={`
                                ${styles.cell} 
                                ${isActive ? styles.active : ''} 
                                ${isSelected ? styles.cursor : ''} 
                                ${getBackgroundClass(null, enemyStatus)}
                            `}
                            onClick={() => {
                                if (isActive) {
                                    setCursorPosition(colIndex);
                                    setSelectedCell({ row: rowIndex, col: colIndex });
                                    setIsEditing(true);
                                    // Enfocamos el contenedor para capturar eventos de teclado
                                    if (boardRef.current) {
                                        boardRef.current.focus();
                                    }
                                }
                            }}
                        >
                            {letter}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Prevenir comportamiento predeterminado para evitar líneas no deseadas
    const handleFocus = () => {
        // Aseguramos que cuando el tablero recibe el foco, la celda seleccionada mantenga su estilo
        setIsEditing(true);
    };

    const handleBlur = () => {
        // Opcional: podrías decidir qué hacer cuando el tablero pierde el foco
        // Por ejemplo, podrías mantener la selección visual
    };

    const handleMouseDown = (e) => {
        // Prevenir el comportamiento predeterminado de selección
        e.preventDefault();
    };

    return (
        <div 
            ref={boardRef} 
            className={styles.wordleContainer} 
            tabIndex={0} 
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={handleMouseDown}
        >
            <h2 className={styles.title}>¡Adivina la palabra!</h2>
            <div className={styles.board}>
                {Array.from({ length: maxAttempts }).map((_, rowIndex) => renderRow(rowIndex))}
            </div>
        </div>
    );
};

export default Board;
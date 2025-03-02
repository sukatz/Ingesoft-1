import React, { useState, useEffect } from 'react';
import styles from './Board.module.css';

const Board = ({ checkWord, wordLength }) => {
    const maxAttempts = 6;
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [inputWords, setInputWords] = useState(Array(maxAttempts).fill(""));
    const [cursorPosition, setCursorPosition] = useState(0);
    const [isWordComplete, setIsWordComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [attempts, setAttempts] = useState([]);

    // Handle cell click to position cursor
    const handleCellClick = (rowIndex, colIndex) => {
        if (rowIndex === currentAttempt) {
            setCursorPosition(colIndex);
            setIsWordComplete(false);
            setIsEditing(true);
        }
    };

    // Handle keyboard input
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
                const newAttempts = [...attempts, {
                    word: trimmedWord,
                    colors: colors
                }];
                
                setAttempts(newAttempts);
                setCurrentAttempt(prev => Math.min(prev + 1, maxAttempts));
                setCursorPosition(0);
                setIsWordComplete(false);
                setIsEditing(true);
            }
        }
        
        setInputWords(newWords);
    };

    const getBackgroundClass = (code) => {
        switch (code) {
            case 0: return styles.gray;
            case 1: return styles.yellow;
            case 2: return styles.green;
            default: return styles.empty;
        }
    };

    const renderRow = (rowIndex) => {
        if (attempts[rowIndex]) {
            const { word, colors } = attempts[rowIndex];
            return (
                <div className={styles.row} key={`row-${rowIndex}`}>
                    {Array.from({ length: wordLength }).map((_, colIndex) => {
                        const letter = word[colIndex] || '';
                        const status = colors[colIndex];
                        return (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`${styles.cell} ${getBackgroundClass(status)}`}
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

                    return (
                        <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            className={`${styles.cell} ${isActive ? styles.active : ''} ${isCursor ? styles.cursor : ''}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {letter}
                        </div>
                    );
                })}
            </div>
        );
    };

    useEffect(() => {
        const container = document.querySelector(`.${styles.wordleContainer}`);
        if (container) {
            container.focus();
        }
    }, []);

    return (
        <div 
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

import React from 'react';
import styles from './Board.module.css';

const Board = ({ attempts = [] }) => {
    const maxAttempts = 6;
    const wordLength = attempts.length > 0 ? attempts[0].word.length : 5;


    const getBackgroundClass = (code) => {
        switch (code) {
            case 0: return styles.gray;
            case 1: return styles.yellow;
            case 2: return styles.green;
            default: return styles.empty;
        }
    };

    const renderRow = (rowIndex) => {
        // Intento actual o un intento vacío si no existe
        const attempt = attempts[rowIndex] || { word: "     ", colors: Array(wordLength).fill(null) }; 
        const { word, colors } = attempt;

        return (
            <div className={styles.row} key={`row-${rowIndex}`}>
                {Array.from({ length: wordLength }).map((_, colIndex) => {
                    const letter = word[colIndex] || ''; 
                    const status = colors[colIndex] !== undefined ? colors[colIndex] : null;

                    return (
                        <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            className={`${styles.cell} ${status !== null ? getBackgroundClass(status) : styles.empty}`}
                        >
                            {letter}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.wordleContainer}>
            <h2 className={styles.title}>¡Adivina la palabra!</h2>
            <div className={styles.board}>
                {Array.from({ length: maxAttempts }).map((_, rowIndex) => renderRow(rowIndex))}
            </div>
        </div>
    );
};

export default Board;
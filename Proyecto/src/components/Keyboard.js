import React, { useState, useEffect } from "react";
import styles from "./Keyboard.module.css";

const KEYBOARD_LAYOUT = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

const Keyboard = ({ playerAttempts, targetWord, boardActions }) => {
    const [keyColors, setKeyColors] = useState({});

    useEffect(() => {
        if (!playerAttempts?.length) return;

        const newKeyColors = { ...keyColors };

        playerAttempts.forEach(({ word, colors }) => {
            word.split("").forEach((letter, index) => {
                const colorCode = colors[index];

                if (!newKeyColors[letter] || colorCode > newKeyColors[letter]) {
                    newKeyColors[letter] = colorCode;
                }
            });
        });

        setKeyColors(newKeyColors);
    }, [playerAttempts]);

    const getKeyClass = (letter) => {
        if (letter === "ENTER" || letter === "⌫") return "";
        
        switch (keyColors[letter]) {
            case 0: return styles.gray;
            case 1: return styles.orange;
            case 2: return styles.green;
            default: return "";
        }
    };

    const handleKeyClick = (key) => {
        if (!boardActions) return;

        if (key === "⌫") {
            boardActions.backspace();
        } else if (key === "ENTER") {
            boardActions.enter();
        } else {
            boardActions.addLetter(key);
        }
    };

    return (
        <div className={styles.keyboard}>
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.row}>
                    {row.map((key) => (
                        <button 
                            key={key} 
                            className={`${styles.key} ${getKeyClass(key)} ${(key === "ENTER" || key === "⌫") ? styles.specialKey : ""}`}
                            onClick={() => handleKeyClick(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
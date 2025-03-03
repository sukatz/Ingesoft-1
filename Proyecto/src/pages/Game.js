import Board from '../components/Board';
import Keyboard from "../components/Keyboard";
import { useState, useEffect } from 'react';
import verifyWord from "../firebase/gameLogic"; 

function Game() {
    const [targetWord, setTargetWord] = useState("REACT");
    const [enemyColors, setEnemyColors] = useState(
        Array(6).fill(Array(targetWord.length).fill(null)) // Matriz 6x3 inicial
    );

    const checkWord = (attempt) => {
        return verifyWord(targetWord, attempt);
    };

    const receiveEnemyData = (newColors, attemptIndex) => {
        setEnemyColors(prevColors => {
            const updatedColors = [...prevColors];
            updatedColors[attemptIndex] = newColors;
            return updatedColors;
        });
    };

    const handlePlayerAttempt = (colors, attemptIndex) => {
        console.log("Colores recibidos:", colors, "Intento:", attemptIndex);

        if (attemptIndex < 6) {
            receiveEnemyData(colors, attemptIndex);
            attemptIndex++;
        }
    };

    // useEffect((colors, attemptIndex) => {
    //     const receiveEnemyData = (newColors, attemptIndex) => {
    //         setEnemyColors(prevColors => {
    //             const updatedColors = [...prevColors];
    //             updatedColors[attemptIndex] = newColors;
    //             return updatedColors;
    //         });
    //     };

    //     const interval = setInterval(() => {
    //         if (attemptIndex < 6) {
    //             receiveEnemyData(colors, attemptIndex);
    //             attemptIndex++;
    //         }
    //     }, 3000);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        <>
            <Board 
                checkWord={checkWord} 
                enemyColors={enemyColors}  // 🔹 Enviamos la MATRIZ de colores
                wordLength={targetWord.length} 
                onAttempt={handlePlayerAttempt} // Nuevo prop
            />
            <Keyboard />
        </>
    );
}

export default Game;

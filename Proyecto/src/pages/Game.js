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

    useEffect(() => {
        const receiveEnemyData = (newColors, attemptIndex) => {
            setEnemyColors(prevColors => {
                const updatedColors = [...prevColors];
                updatedColors[attemptIndex] = newColors;
                return updatedColors;
            });
        };

        // Simulación de intentos del enemigo
        let attemptIndex = 0;
        const interval = setInterval(() => {
            if (attemptIndex < 6) {
                const newColors = [
                    Math.floor(Math.random() * 5), 
                    Math.floor(Math.random() * 5), 
                    Math.floor(Math.random() * 5)
                ]; // Simulación de colores
                receiveEnemyData(newColors, attemptIndex);
                attemptIndex++;
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Board 
                checkWord={checkWord} 
                enemyColors={enemyColors}  // 🔹 Enviamos la MATRIZ de colores
                wordLength={targetWord.length} 
            />
            <Keyboard />
        </>
    );
}

export default Game;

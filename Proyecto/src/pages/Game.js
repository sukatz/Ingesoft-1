import Board from '../components/Board';
import Keyboard from "../components/Keyboard";
import { useState, useEffect } from 'react';
import verifyWord from "../firebase/gameLogic"; 
import getRandomWord from "../firebase/GetRandomWord";

function Game() {
    const [targetWord, setTargetWord] = useState(null);
    const [enemyColors, setEnemyColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playerAttempts, setPlayerAttempts] = useState([]); 
    // Referencia de las funciones del Board para el teclado
    const [boardActions, setBoardActions] = useState(null);

    useEffect(() => {
        const fetchWord = async () => {
            const randomWord = await getRandomWord();
            if (randomWord) {
                setTargetWord(randomWord.toUpperCase());
                setEnemyColors(Array(6).fill(Array(randomWord.length).fill(null))); 
            }
            setLoading(false);
        };
        fetchWord();
    }, []);

    useEffect(() => {
        if (!targetWord) return;

        const receiveEnemyData = (newColors, attemptIndex) => {
            setEnemyColors(prevColors => {
                const updatedColors = [...prevColors];
                updatedColors[attemptIndex] = newColors;
                return updatedColors;
            });
        };

        let attemptIndex = 0;
        const interval = setInterval(() => {
            if (attemptIndex < 6) {
                const newColors = Array(targetWord.length)
                    .fill(null)
                    .map(() => Math.floor(Math.random() * 5));
                receiveEnemyData(newColors, attemptIndex);
                attemptIndex++;
            } else {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [targetWord]);

    const checkWord = (attempt) => {
        return verifyWord(targetWord, attempt);
    };

    if (loading) return <p>Cargando palabra...</p>;

    return (
        <>
            <Board 
                checkWord={checkWord} 
                enemyColors={enemyColors}
                wordLength={targetWord.length} 
                setPlayerAttempts={setPlayerAttempts}
                setBoardActions={setBoardActions} // Pasamos la función para guardar las acciones
            />
            <Keyboard 
                playerAttempts={playerAttempts} 
                targetWord={targetWord} 
                boardActions={boardActions} // Pasamos las acciones al teclado
            />
        </>
    );
}

export default Game;
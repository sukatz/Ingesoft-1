import Board from '../components/Board';
import Keyboard from "../components/Keyboard";
import { useState, useEffect } from 'react';
import verifyWord from "../firebase/gameLogic"; 
import { useParams } from 'react-router-dom';  
import { doc, getDoc } from 'firebase/firestore';  
import { db } from '../firebase/config';  

function Game() {
    const { matchId } = useParams(); 
    const [targetWord, setTargetWord] = useState(() => {
        return sessionStorage.getItem(`word_${matchId}`) || null;
    });

    const [enemyColors, setEnemyColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playerAttempts, setPlayerAttempts] = useState([]); 
    // Referencia de las funciones del Board para el teclado
    const [boardActions, setBoardActions] = useState(null);

useEffect(() => {
    const fetchWordFromDB = async () => {
        try {
            const matchRef = doc(db, "match", matchId);
            const matchSnap = await getDoc(matchRef);

            if (matchSnap.exists()) {
                const matchData = matchSnap.data();
                const newTargetWord = matchData.secret_word.toUpperCase(); 
                setTargetWord(newTargetWord);
                sessionStorage.setItem(`word_${matchId}`, newTargetWord); 
                setEnemyColors(Array(6).fill(Array(newTargetWord.length).fill(null))); // 
                console.error("La partida no existe.");
            }
        } catch (error) {
            console.error("Error al obtener la palabra:", error);
        }
        setLoading(false);
    };

    fetchWordFromDB();
}, [matchId]); 


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

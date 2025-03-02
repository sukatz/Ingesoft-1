import Board from '../components/Board';
import Keyboard from "../components/Keyboard";
import { useState } from 'react';

// In Game.js, update the import:
import verifyWord from "../firebase/gameLogic"; // Import as default export

function Game() {
    const [targetWord, setTargetWord] = useState("PAN");
    
    const checkWord = (attempt) => {
        return verifyWord(targetWord, attempt);
    };

    return (
        <>
            <Board checkWord={checkWord} wordLength={targetWord.length} />
            <Keyboard />
        </>
    );
}

export default Game;
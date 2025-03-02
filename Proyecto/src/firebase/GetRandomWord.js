import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getRandomWord = async (gameMode = "NORMAL") => {
    try {
        const wordsCollection = collection(db, 'words');
        const q = query(wordsCollection, where("game_mode", "==", gameMode));

        const querySnapshot = await getDocs(q);
        const filteredWords = querySnapshot.docs.map(doc => doc.data().word);
        return filteredWords[Math.floor(Math.random() * filteredWords.length)];

    } catch (error) {
        console.error("Error al obtener una palabra:", error);
        return null;
    }
};



import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getRandomWord = async (gameMode = "NORMAL") => {
    try {
        const randomIndex = Math.floor(Math.random() * 972); // Generar número aleatorio entre 0 y 971

        const wordsCollection = collection(db, 'words');
        const q = query(wordsCollection, 
            where("game_mode", "==", gameMode), 
            where("index", "==", randomIndex) // Filtrar por índice aleatorio
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("No se encontró una palabra con el índice generado:", randomIndex);
            return null;
        }

        return querySnapshot.docs[0].data().word; // Retornar la palabra del primer documento encontrado

    } catch (error) {
        console.error("Error al obtener una palabra:", error);
        return null;
    }
};


export default getRandomWord
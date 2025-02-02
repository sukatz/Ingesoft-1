import {
    collection,     // Para referenciar una colección
    addDoc,        // Para añadir documentos
    getDocs,       // Para obtener documentos
    updateDoc,     // Para actualizar documentos
    deleteDoc,     // Para eliminar documentos
    doc,           // Para referenciar un documento específico
    query,         // Para hacer consultas
    where,
    onSnapshot          // Para filtrar consultas
} from 'firebase/firestore';

import { db } from './config';

export const addUserToQueue = async (nickname) => {
    try {
        const queueCollection = collection(db, 'queue');
        const docRef = await addDoc(queueCollection, {
            nickname: nickname,
            queue_status: 'waiting',
            elapsed_time: new Date()
        });
        console.log('Usuario agregado a la cola:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error al agregar usuario a la cola:', error);
        return null;
    }
}

export const checkForWaitingPlayer = (callback) => {
    try {
        const queueCollection = collection(db, 'queue');
        const q = query(queueCollection, where('queue_status', '==', 'waiting'));

        // Usamos onSnapshot para recibir actualizaciones en tiempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Si hay un jugador esperando, obtenemos el primer jugador
                const waitingPlayerDocumentId = querySnapshot.docs[0].id;
                console.log('Partida encontrada con ID:', waitingPlayerDocumentId);
                callback(waitingPlayerDocumentId); // Llamamos a la función de callback con el ID del jugador
            } else {
                console.log('No hay jugadores esperando.');
                callback(null); // No hay jugadores esperando
            }
        });

        // El unsubscribe es una función para dejar de escuchar los cambios
        return unsubscribe;
    } catch (error) {
        console.error('Error al verificar si hay un jugador esperando:', error);
        return null;
    }
};

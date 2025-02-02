import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot
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

export const checkForWaitingUser = (userQueueId, callback) => {
    try {
        const queueCollection = collection(db, 'queue');
        
        const q = query(
            queueCollection,
            where('queue_status', '==', 'waiting'),
            where('__name__', '!=', userQueueId) 
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const waitingUserDocumentId = querySnapshot.docs[0].id;
                console.log('Partida encontrada con ID:', waitingUserDocumentId);
                callback(waitingUserDocumentId);
            } else {
                console.log('No hay jugadores esperando.');
                callback(null);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error al verificar si hay un jugador esperando:', error);
        return null;
    }
};

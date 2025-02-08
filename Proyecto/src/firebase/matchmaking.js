import {
    collection,
    query,
    where,
    getDocs,
    runTransaction,
    doc,
    serverTimestamp
} from 'firebase/firestore';

import { db } from './config';

export const checkForMatch = async (userNickname) => {
    try {
        const matchCollection = collection(db, 'match');

        const q = query(
            matchCollection,
            where('match_status', '==', 'waiting'),
            where('player_1', '!=', userNickname)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const waitingMatch = querySnapshot.docs[0];
            const matchId = waitingMatch.id;

            await runTransaction(db, async (transaction) => {
                const matchRef = doc(db, 'match', matchId);
                const matchDoc = await transaction.get(matchRef);

                if (matchDoc.exists() && matchDoc.data().player_2 === '') {
                    transaction.update(matchRef, {
                        player_2: userNickname,
                        match_status: 'ongoing'
                    });

                    console.log('Partida encontrada y actualizada:', matchId);
                    return matchId;
                }
            });

            return matchId;
        }

        console.log('No hay partidas esperando.');
        return null;
    } catch (error) {
        console.error('Error al verificar si hay una partida esperando:', error);
        return null;
    }
};

export const addUserToMatch = async (userNickname) => {
    try {
        const matchCollection = collection(db, 'match');

        const matchId = await runTransaction(db, async (transaction) => {
            const q = query(
                matchCollection,
                where('match_status', '==', 'waiting'),
                where('player_1', '!=', userNickname)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const waitingMatch = querySnapshot.docs[0];
                const matchId = waitingMatch.id;

                if (waitingMatch.data().player_2 === '') {
                    transaction.update(waitingMatch.ref, {
                        player_2: userNickname,
                        match_status: 'ongoing'
                    });

                    console.log('Usuario unido a la partida existente:', matchId);
                    return matchId;
                }
            }

            const newMatchRef = doc(matchCollection);
            transaction.set(newMatchRef, {
                player_1: userNickname,
                player_2: '',
                match_status: 'waiting',
                elapsed_time: serverTimestamp()
            });

            console.log('Nueva partida creada:', newMatchRef.id);
            return newMatchRef.id;
        });

        return matchId;
    } catch (error) {
        console.error('Error al agregar usuario a la partida:', error);
        return null;
    }
};
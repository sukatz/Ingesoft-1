import { useState } from 'react';
import { checkForWaitingPlayer, addUserToQueue } from '../firebase/matchmaking';



export const useQueue = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkAndAddUser = async (nickname) => {
        setLoading(true);
        setError(null);

        try {
            // Verificamos si ya hay un jugador esperando en la cola
            const waitingPlayerDocumentId = await checkForWaitingPlayer();

            if (waitingPlayerDocumentId) {
                // Si hay un jugador esperando, lo emparejamos
                console.log('Partida encontrada con el jugador ID:', waitingPlayerDocumentId);
                return { success: true, queueDocumentId: waitingPlayerDocumentId };
            } else {
                // Si no hay jugadores esperando, agregamos al nuevo jugador a la cola
                const newQueueDocumentId = await addUserToQueue(nickname);
                return { success: true, queueDocumentId: newQueueDocumentId };
            }
        } catch (err) {
            setError('Ocurrió un error al procesar la solicitud.');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, checkAndAddUser };
};

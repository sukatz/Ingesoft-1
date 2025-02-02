import { useState } from 'react';
import { addUserToQueue, checkForWaitingUser } from '../firebase/matchmaking';

const useQueue = (nickname) => {
    const [status, setStatus] = useState('idle'); // 'idle', 'waiting', 'matched', 'error'
    const [error, setError] = useState(null);
    const [waitingPlayerId, setWaitingPlayerId] = useState(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const addToQueueAndCheck = async () => {
        try {
            setIsProcessing(true);
            setStatus('waiting');
            setError(null);

            const userId = await addUserToQueue(nickname);
            if (!userId) {
                setStatus('error');
                setError('Error al agregar el usuario a la cola');
                return;
            }

            console.log('Jugador agregado a la cola con ID:', userId);

            checkForWaitingUser(userId, (foundPlayerId) => {
                if (foundPlayerId) {
                    setStatus('matched');
                    setWaitingPlayerId(foundPlayerId);
                } else {
                
                    setStatus('waiting');
                }
            });

        } catch (err) {
            setError(err.message);
            setStatus('error');
        } finally {
            
        }
    };

    return { status, error, waitingPlayerId, addToQueueAndCheck, isProcessing };
};

export default useQueue;

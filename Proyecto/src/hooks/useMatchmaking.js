import { useState, useEffect } from 'react';
import { addUserToMatch, checkForMatch } from '../firebase/matchmaking';

const useMatchmaking = (shouldSearch, nickname) => {
    const [matchId, setMatchId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shouldSearch || !nickname) {
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const findOrCreateMatch = async () => {
            try {
                const matchId = await checkForMatch(nickname);

                if (matchId) {
                    setMatchId(matchId);
                    return;
                }

                const newMatchId = await addUserToMatch(nickname);
                setMatchId(newMatchId);
            } catch (error) {
                console.error('Error en matchmaking:', error);
                setError(error);
            } finally {
                setIsSearching(false);
            }
        };

        findOrCreateMatch();
    }, [shouldSearch, nickname]);

    return { matchId, isSearching, error };
};

export default useMatchmaking;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQueue from '../hooks/useMatchmaking';
import styles from "./TextField.module.css";

function TextField() {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { status, error, waitingPlayerId, addToQueueAndCheck, isProcessing } = useQueue(nickname);

    const maxLength = 20;

    const handleChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-z]/g, '');
        if (value.length <= maxLength) {
            setNickname(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isProcessing) return;
    
        setLoading(true);
        console.log('Intentando agregar a la cola...');
    
        try {
            await addToQueueAndCheck();
    
            if (status === 'matched' && waitingPlayerId) {
                console.log('Emparejando con jugador ID:', waitingPlayerId);
                navigate(`/game/${waitingPlayerId}`);
            } else if (status === 'waiting') {
                console.log('Esperando a otro jugador...');
            } else if (status === 'error') {
                console.error('Error al agregar a la cola:', error);
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    className={styles.nicknameField}
                    type="text"
                    placeholder="Ingresa tu nickname"
                    value={nickname}
                    onChange={handleChange}
                    maxLength={maxLength}
                    autoFocus
                />
                <input
                    className={styles.searchButton}
                    type="submit"
                    value={loading ? 'Cargando...' : 'Buscar Partida'}
                    disabled={nickname.length === 0 || loading}
                />
            </form>
        </div>
    );
}

export default TextField;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQueue from '../hooks/useMatchmaking';
import styles from "./Home.module.css";
import logo from "../assets/logo.png";

function TextField() {
    const [nickname, setNickname] = useState('');
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
        }
    };

    return (
        <div className={styles.container}>

            <img className={styles.logo} src={logo} alt="Logo" />

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
                    value={isProcessing ? 'Buscando...' : 'Buscar Partida'}
                    disabled={nickname.length === 0 || isProcessing}
                />
            </form>
        
            {isProcessing && (
                <div className={styles.spinner}>
                    <div className={styles.spinnerCircle}></div>
                    
                </div>
            )}
        </div>
    );
}

export default TextField;
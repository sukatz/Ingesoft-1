import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../hooks/useMatchmaking';  // Importar el custom hook
import styles from "./TextField.module.css";


function TextField() {

    const [nickname, setNickname] = useState('');
    const { loading, error, checkAndAddUser } = useQueue(); 
    
    const maxLength = 20;

    const handleChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-z]/g, '');
        if (value.length <= maxLength) {
            setNickname(value);
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { success, queueId, error } = await checkAndAddUser(nickname);

        if (success) {
            console.log(`Usuario manejado con éxito, ID: ${queueId}`);
            
        } else {
            console.error('Error al manejar el usuario:', error);
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
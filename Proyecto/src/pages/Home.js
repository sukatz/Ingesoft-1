import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkForWaitingPlayer, addUserToQueue } from '../firebase/matchmaking';
import styles from "./TextField.module.css";

function TextField() {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Para redirigir a otras páginas

    const maxLength = 20;

    const handleChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-z]/g, '');  // Solo letras
        if (value.length <= maxLength) {
            setNickname(value);  // Actualiza el estado de nickname
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Evita el comportamiento por defecto (recarga de página)

        // 1. Verificar el valor de nickname antes de enviar
        console.log('Nickname antes de enviar:', nickname);  // Verifica qué valor tiene nickname

        if (!nickname) {
            console.error('El nickname no puede estar vacío o undefined');
            return;
        }

        setLoading(true);  // Activa el estado de carga
        console.log('Intentando agregar a la cola...');  // Marca el inicio del proceso

        try {
            // 2. Llamada a la función para agregar el usuario a la cola
            const userId = await addUserToQueue(nickname);
            
            // 3. Verificar si obtuvimos un ID de usuario y loguearlo
            console.log('ID del usuario agregado:', userId);  // Ver el ID generado

            if (userId) {
                // 4. Redirigir a la página de espera si todo fue bien
                
            } else {
                console.error('No se pudo agregar el usuario a la cola');
            }
        } catch (error) {
            // 5. Capturar y loguear el error si algo sale mal
            console.error('Error al manejar el usuario:', error);  // Ver detalles del error
        } finally {
            // 6. Desactivar el estado de carga, independientemente de lo que suceda
            setLoading(false);  // Desactiva el estado de carga
            console.log('Proceso de cola terminado. Estado de carga desactivado.');
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

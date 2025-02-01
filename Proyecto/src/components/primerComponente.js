import React, { useEffect } from 'react';
import { addTestData } from '../firebase/firestore';

const Prueba = () => {
    console.log("Primer Componente renderizado");
    
    return (
        <div>
            <h2>Prueba de Firestore</h2>
            <button onClick={() => addTestData()}>
                Hacer prueba de conexión
            </button>
        </div>
    );
    
};

export { Prueba };
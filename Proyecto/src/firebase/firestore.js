import {
    collection,     // Para referenciar una colección
    addDoc,        // Para añadir documentos
    getDocs,       // Para obtener documentos
    updateDoc,     // Para actualizar documentos
    deleteDoc,     // Para eliminar documentos
    doc,           // Para referenciar un documento específico
    query,         // Para hacer consultas
    where          // Para filtrar consultas
} from 'firebase/firestore';

import { db } from './config';



console.log('Archivo firestore.js cargado');

// Función para agregar un dato de prueba


// Función para obtener datos
export const getTestData = async () => {
    try {
        const testCollection = collection(db, 'pruebas');
        const querySnapshot = await getDocs(testCollection);
        querySnapshot.forEach((doc) => {
            console.log('Documento:', doc.id, doc.data());
        });
        return querySnapshot;
    } catch (error) {
        console.error('Error al obtener documentos:', error);
        return null;
    }
};

export const addTestData = async () => {
    try {
        const testCollection = collection(db, 'pruebas');
        const docRef = await addDoc(testCollection, {
            mensaje: "Prueba de conexión",
            fecha: new Date()
        });
        alert('¡Documento agregado con éxito!'); // Esto mostrará una alerta visible
        return true;
    } catch (error) {
        alert('Error: ' + error.message); // Esto mostrará el error si algo falla
        return false;
    }
};
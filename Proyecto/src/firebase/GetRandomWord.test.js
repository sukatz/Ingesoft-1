import { getRandomWord } from './GetRandomWord';
import { getDocs } from 'firebase/firestore';

// Mock de Firebase Firestore
jest.mock('./config', () => ({
    db: {} // Mock del objeto db para evitar el error
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn()
}));

describe('getRandomWord', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe retornar una palabra válida si Firestore tiene datos', async () => {
        const mockDocs = [{ data: () => ({ word: "prueba" }) }];
        getDocs.mockResolvedValue({ empty: false, docs: mockDocs });

        const word = await getRandomWord("NORMAL");
        expect(word).toBe("prueba");
    });

    test('Debe retornar null si Firestore no devuelve resultados', async () => {
        getDocs.mockResolvedValue({ empty: true, docs: [] });

        const word = await getRandomWord("NORMAL");
        expect(word).toBeNull();
    });

    test('Debe manejar errores correctamente y retornar null', async () => {
        getDocs.mockRejectedValue(new Error("Error de conexión"));

        const word = await getRandomWord("NORMAL");
        expect(word).toBeNull();
    });
});


import verifyWord from "./gameLogic";

describe("Función verifyWord", () => {
    test("Todas las letras correctas y en la posición correcta", () => {
        expect(verifyWord("apple", "apple")).toEqual([2, 2, 2, 2, 2]);
    });

    test("Todas las letras incorrectas", () => {
        expect(verifyWord("apple", "storm")).toEqual([0, 0, 0, 0, 0]);
    });

    test("Algunas letras en la posición correcta, otras incorrectas", () => {
        expect(verifyWord("apple", "apron")).toEqual([2, 2, 0, 0, 0]);
    });

    test("Algunas letras en la posición incorrecta", () => {
        expect(verifyWord("apple", "pleap")).toEqual([1, 1, 1, 1, 1]);
    });

    
});


import Board from '../components/Board';
import Keyboard from "../components/Keyboard";

function Game() {
    return (
        <>
            <Board
                attempts=
				{[
                    { word: "ARBOL", colors: [2, 1, 0, 0, 1] }, // aqui se mete la lista de listas xd
					// { word: "intento2", colors: [x,x,x,x,x]},
					// etc... si se pasa solo una lista dentro de toda la lista, el tablero funciona 
					// correctamente, y pondra las casillas en blanco

					// falta la logica para pintar el otro tablero por debajo
                ]}
            />	
            <Keyboard />
        </>
    );
}

export default Game;

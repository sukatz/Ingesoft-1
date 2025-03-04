import { render, screen, fireEvent } from '@testing-library/react';
import Board from './Board';

test('Permite ingresar letras en el tablero en la celda correcta', () => {
    const wordLength = 5;
    render(<Board wordLength={wordLength} checkWord={() => {}} setPlayerAttempts={() => {}} setBoardActions={() => {}} enemyColors={[]} />);

    const board = screen.getByRole('textbox');
    fireEvent.focus(board);
    
    // Simular ingreso de letras
    fireEvent.keyDown(board, { key: 'A' });
    fireEvent.keyDown(board, { key: 'B' });
    fireEvent.keyDown(board, { key: 'C' });
    
    // Verificar que las letras aparecieron en la primera fila
    const firstRow = screen.getAllByTestId('row-0');
    expect(firstRow[0]).toHaveTextContent('A');
    expect(firstRow[1]).toHaveTextContent('B');
    expect(firstRow[2]).toHaveTextContent('C');
});


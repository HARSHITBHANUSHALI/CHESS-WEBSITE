import '../index.css';
import { useChess } from '../ChessContext';

const Board = ({grid, boxColor, piece, isValidMove }) => {
  
  console.log(grid);

  if (!grid) {
    return <div>Loading...</div>; // Or handle the loading state appropriately
  }

  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              onClick={() => isValidMove(cell, cellIndex, rowIndex)}
              className={`grid-cell cursor-pointer ${boxColor(rowIndex, cellIndex)}`}
            >
              {cell && <img src={piece(cell)} className="cursor-pointer" alt="" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

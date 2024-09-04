import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChess } from '../ChessContext';
import Board from '../components/Board';

const ViewGamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game } = location.state || {};
  const { setUserSide, setGrid, setTotalMoves, piece, letters } = useChess();
  const movesContainerRef = useRef(null);
  const [loading, setLoading] = useState(true); 
  const [gameGrid, setGameGrid] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  useEffect(() => {
    if (game) {
      const parsedGameState = JSON.parse(game.gameState);
      setUserSide(game.userSide);
      setGrid(game.gameState);
      setGameGrid(parsedGameState);
      setTotalMoves(game.moves); 
      setLoading(false); 
    } else {
      console.log("No Game data");
      setLoading(true);
    }
  }, [game, setUserSide, setGrid, setTotalMoves]);

  useEffect(() => {
    if (movesContainerRef.current && game?.moves?.length > 0) {
      movesContainerRef.current.scrollTop = movesContainerRef.current.scrollHeight;
    }
  }, [game?.moves]);

  useEffect(() => {
    if (game?.moves) {
      updateBoardForMove(currentMoveIndex);
    }
  }, [currentMoveIndex, game]);

  const updateBoardForMove = (index) => {
    if (!game || !game.moves || game.moves.length === 0) return;

    let newBoardState = JSON.parse(game.gameState);

    for (let i = 0; i <= index; i++) {
      const move = game.moves[i];
      if (move) {
        const { start, end } = move;
        const spiece = start.cell;
        const epiece = end.cell;
        newBoardState[start.rowIndex][start.cellIndex] = spiece;
        if(epiece !== '')
          newBoardState[end.rowIndex][end.cellIndex] = epiece;
        else
          newBoardState[end.rowIndex][end.cellIndex] = '';
      }
    }

    setGameGrid(newBoardState);
  };

  const handleForward = () => {
    if (currentMoveIndex < (game.moves.length - 1)) {
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  };

  const handleBackward = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };

  if (loading && !game) {
    return <div>Loading...</div>;
  }

  if (!game || !game.moves || game.moves.length === 0) {
    return <div>No game data found or moves available.</div>;
  }

  const user = game.players.find(p => p.userId === game.userSide);
  const opponent = game.players.find(p => p.userId !== game.userSide);
  const opponentName = opponent ? opponent.username : 'Guest';

  const boxColor = (rowIndex, cellIndex) => {
    return (rowIndex + cellIndex) % 2 === 0 ? 'bg-beige' : 'bg-green';
  };

  return (
    <div className='main min-h-screen bg-gray-900 text-white p-4'>
      <div className='text-center text-2xl font-semibold mb-4'>
        Final Position
      </div>
      <div className='flex flex-col lg:flex-row lg:gap-4 items-center lg:items-start lg:justify-around h-full lg:h-[85vh]'>
        <div className='flex flex-col lg:w-3/4 items-center mb-4 lg:mb-0'>
          <div className='flex mb-4'>
            <button className='bg-blue-500 text-white py-2 px-4 rounded mr-2' onClick={handleBackward}>Backward</button>
            <button className='bg-blue-500 text-white py-2 px-4 rounded' onClick={handleForward}>Forward</button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Board grid={gameGrid} boxColor={boxColor} piece={piece} />
          )}
        </div>
        <div className='flex flex-col flex-grow w-2/3 lg:w-1/4 items-center bg-[#262522] rounded-lg p-4'>
          <div className='flex items-center gap-4 w-full bg-[rgb(28,27,25)] rounded-lg p-4 mb-4'>
            <img src={user?.photos?.length > 0 ? `https://chess-website-zs36.onrender.com/uploads/${user.photos[0]}` : '/user.svg'} alt="User" className='w-16 h-16 p-2 rounded-full border-2 border-gray-700' />
            <div>
              <p className='text-lg font-bold'>{user?.username || 'Guest'}</p>
              <p className='text-sm text-gray-400'>{game.userSide === 1 ? 'White' : 'Black'}</p>
            </div>
          </div>
          <div className='flex flex-col w-full gap-2'>
            <h2 className='text-lg font-bold mb-2'>Moves</h2>
            <div className='h-[1px] bg-slate-400'></div>
            <div ref={movesContainerRef} className='overflow-y-auto custom-scrollbar h-64'>
              <ul className='grid grid-cols-2 rounded-md overflow-hidden'>
                {game.moves.map((move, index) => (
                  <li className='flex items-center justify-between p-2 bg-[#201f1d] mb-2' key={index}>
                    {index % 2 === 0 && (
                      <span className='text-sm'>{index / 2 + 1}</span>
                    )}
                    <div className='flex items-center'>
                      <img className='h-6' src={piece(move.start.cell)} alt="" />
                      {`(${letters[move.end.cellIndex]}${8 - move.end.rowIndex})`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='flex items-center gap-4 w-full bg-[rgb(28,27,25)] rounded-lg p-4 mt-4'>
            <img src={opponent?.photos?.length > 0 ? `https://chess-website-zs36.onrender.com/uploads/${opponent.photos[0]}` : '/user.svg'} alt="Opponent" className='w-16 h-16 rounded-full border-2 border-gray-700 p-2' />
            <div>
              <p className='text-lg font-bold'>{opponentName}</p>
              <p className='text-sm text-gray-400'>{game.userSide === 1 ? 'Black' : 'White'}</p>
            </div>
          </div>
          <button className='bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full lg:w-auto' onClick={() => navigate('/profile')}>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewGamePage;

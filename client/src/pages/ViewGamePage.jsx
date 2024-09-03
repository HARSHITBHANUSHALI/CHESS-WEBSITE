import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChess } from '../ChessContext';
import Board from '../components/Board';
import Chat from '../components/Chat';

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

    // Apply moves up to the current index
    for (let i = 0; i <= index; i++) {
      const move = game.moves[i];
      if (move) {
        const { start, end } = move;
        const spiece = start.cell;
        const epiece = end.cell;
        newBoardState[start.rowIndex][start.cellIndex] = spiece;
        if(epiece!='')
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

  console.log(game);

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
    <div className='main h-screen bg-gray-900 text-white overflow-auto p-4'>
      <div className='flex justify-center text-2xl font-semibold mb-4'>
        Final Position
      </div>
      <div className='flex h-[85vh]'>
        <div className='w-1/4'>
          <Chat />
        </div>
        <div className='w-1/2 flex flex-col items-center'>
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
        <div className='w-1/4'>
          <div className='flex flex-col flex-grow items-center bg-[#262522] rounded-lg m-4 overflow-hidden'>
            <div className='flex items-start gap-4 p-4 w-full bg-[rgb(28,27,25)] rounded-t-lg'>
              <img src={user?.photos?.length > 0 ? `https://chess-website-zs36.onrender.com/uploads/${user.photos[0]}` : '/user.svg'} alt="User" className='w-16 h-16 p-2 rounded-full border-2 border-gray-700' />
              <div>
                <p className='text-lg font-bold'>{user?.username || 'Guest'}</p>
                <p className='text-sm text-gray-400'>{game.userSide === 1 ? 'White' : 'Black'}</p>
              </div>
            </div>
            <div className='flex flex-col w-full gap-2 h-64 p-2'>
              <h2 className='text-lg font-bold mb-2'>Moves</h2>
              <div className='h-[1px] bg-slate-400'></div>
              <div ref={movesContainerRef} className='overflow-y-auto custom-scrollbar'>
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
            <div className='mt-4 flex items-start gap-4 p-4 w-full bg-[rgb(28,27,25)] rounded-b-lg'>
              <img src={opponent?.photos?.length > 0 ? `https://chess-website-zs36.onrender.com/uploads/${opponent.photos[0]}` : '/user.svg'} alt="Opponent" className='w-16 h-16 rounded-full border-2 border-gray-700 p-2' />
              <div>
                <p className='text-lg font-bold'>{opponentName}</p>
                <p className='text-sm text-gray-400'>{game.userSide === 1 ? 'Black' : 'White'}</p>
              </div>
            </div>
          </div>
          <button className='bg-blue-500 text-white py-2 px-4 rounded mt-4' onClick={() => navigate('/profile')}>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewGamePage;

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChess } from '../ChessContext';
import ChessBoard from '../components/ChessBoard';
import Chat from '../components/Chat';

const ViewGamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game } = location.state || {};
  const { setUserSide, setGrid, setTotalMoves, piece, letters } = useChess();
  const movesContainerRef = useRef(null);
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  useEffect(() => {
    if (game) {
      setUserSide(game.userSide);
      setGrid(game.grid);
      setTotalMoves(game.moves); // Assuming `totalMoves` refers to `moves` in your schema
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [game, setUserSide, setGrid, setTotalMoves]);

  useEffect(() => {
    if (movesContainerRef.current && game?.moves?.length > 0) {
      movesContainerRef.current.scrollTop = movesContainerRef.current.scrollHeight;
    }
  }, [game?.moves]);

  if (loading && !game) {
    return <div>Loading...</div>;
  }

  if (!game || !game.moves || game.moves.length === 0) {
    return <div>No game data found or moves available.</div>;
  }

  // Assuming you have logic to determine user and opponent
  const user = game.players.find(p => p.userId === game.userSide);
  const opponent = game.players.find(p => p.userId !== game.userSide);
  const opponentName = opponent ? opponent.username : 'Guest';

  const handleBackToProfile = () => {
    navigate('/profile');
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
        <div className='w-1/2 flex justify-center'>
          <ChessBoard />
        </div>
        <div className='w-1/4'>
          <div className='flex flex-col flex-grow items-center bg-[#262522] rounded-lg m-4 overflow-hidden'>
            <div className='flex items-start gap-4 p-4 w-full bg-[rgb(28,27,25)] rounded-t-lg'>
              {/* Render user information */}
              <img src={user?.photos?.length > 0 ? `http://localhost:3500/uploads/${user.photos[0]}` : '/user.svg'} alt="User" className='w-16 h-16 p-2 rounded-full border-2 border-gray-700' />
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
                  {/* Render moves */}
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
              {/* Render opponent information */}
              <img src={opponent?.photos?.length > 0 ? `http://localhost:3500/uploads/${opponent.photos[0]}` : '/user.svg'} alt="Opponent" className='w-16 h-16 rounded-full border-2 border-gray-700 p-2' />
              <div>
                <p className='text-lg font-bold'>{opponentName}</p>
                <p className='text-sm text-gray-400'>{game.userSide === 1 ? 'Black' : 'White'}</p>
              </div>
            </div>
          </div>
          <button className='bg-blue-500 text-white py-2 px-4 rounded mt-4' onClick={handleBackToProfile}>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewGamePage;

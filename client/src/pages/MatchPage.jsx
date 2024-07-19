import React, { useEffect, useRef } from 'react';
import ChessBoard from '../components/ChessBoard';
import { useChess } from '../ChessContext';
import Chat from '../components/Chat';
import {useNavigate} from 'react-router-dom';

const MatchPage = () => {
  const { user, room, socket, opponent, inRoom, turn, grid, userSide, totalMoves, piece, letters,winner,setWinner } = useChess();
  const movesContainerRef = useRef(null);
  const navigate = useNavigate();

  const opponentSide = userSide === 1 ? 0 : 1;
  const opponentName = opponent ? opponent.username : 'Guest';

  useEffect(() => {
      if (movesContainerRef.current) {
          movesContainerRef.current.scrollTop = movesContainerRef.current.scrollHeight;
      }
  }, [totalMoves]);

  if (!inRoom || !user || !totalMoves || !grid) {
      return null;
  }

  const handleBackToHome = () => {
      navigate('/');
      setWinner(null);
  };

  const handleLeaveRoom = ()=>{
    socket.emit('leaveRoom',{user,room});
  }
  return (
      <>
        <div className='main h-screen bg-gray-900 text-white overflow-auto p-4'>
            <div className='flex justify-center text-2xl font-semibold mb-4'>
                {turn === 1 ? 'White\'s Turn' : 'Black\'s Turn'}
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
                            <img src={user?.photos?.length > 0 ? 'http://localhost:3500/uploads/' + user?.photos[0] : '/user.svg'} alt="User" className='w-16 h-16 p-2 rounded-full border-2 border-gray-700' />
                            <div>
                                <p className='text-lg font-bold'>{user?.username || 'Guest'}</p>
                                <p className='text-sm text-gray-400'>{userSide === 1 ? 'White' : 'Black'}</p>
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-2 h-64 p-2'>
                            <h2 className='text-lg font-bold mb-2'>Total Moves</h2>
                            <div className='h-[1px] bg-slate-400'></div>
                            <div ref={movesContainerRef} className='overflow-y-auto custom-scrollbar'>
                                <ul className='grid grid-cols-2 rounded-md overflow-hidden'>
                                    {totalMoves.map((move, index) => (
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
                            <img src={opponent?.photos?.length > 0 ? 'http://localhost:3500/uploads/' + opponent?.photos[0] : '/user.svg'} alt="Opponent" className='w-16 h-16 rounded-full border-2 border-gray-700 p-2' />
                            <div>
                                <p className='text-lg font-bold'>{opponentName}</p>
                                <p className='text-sm text-gray-400'>{opponentSide === 1 ? 'White' : 'Black'}</p>
                            </div>
                        </div>
                    </div>
                    <div >
                      <button className='rounded-xl font-semibold p-2 overflow-hidden' onClick={handleLeaveRoom}>Leave Match</button>
                    </div>
                </div>
            </div>
            {winner && (
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-[rgb(28,27,25)] w-2/5 p-8 rounded-lg shadow-lg text-center'>
                        <h2 className='text-4xl font-bold mb-4'>{user.username === winner.winnerName ? 'You Win!' : `${winner.winnerName} Wins`}</h2>
                        <div className='flex items-center justify-around mb-4'>
                            <div className='text-center'>
                              <div className='flex items-center gap-4'>
                                <div>
                                  <img src={user?.photos?.length > 0 ? 'http://localhost:3500/uploads/' + user?.photos[0] : '/user.svg'} alt="User" className='w-16 h-16 rounded-full border-2 border-gray-700 p-2' />
                                  <p className='text-3xl'>{user.username}</p>
                                </div>
                              </div>
                            </div>
                            <div className='flex text-4xl gap-4'>
                                <div>{user.username === winner.winnerName ? '1' : '0'}</div>
                                <p>-</p>
                                <div>{opponentName === winner.winnerName ? '1' : '0'}</div>
                            </div>
                            <div className='text-center'>
                              <div className='flex items-center gap-4'>
                                <div>
                                  <img src={opponent?.photos?.length > 0 ? 'http://localhost:3500/uploads/' + opponent?.photos[0] : '/user.svg'} alt="Opponent" className='w-16 h-16 rounded-full border-2 border-gray-700 p-2' />
                                  <p className='text-3xl'>{opponentName}</p>
                                </div>
                              </div>
                            </div>
                        </div>
                        <button onClick={handleBackToHome} className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Back to Home</button>
                    </div>
                </div>
            )}
        </div>
          <style jsx>{`
              .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #888 #262522;
              }
              .custom-scrollbar::-webkit-scrollbar {
                  width: 12px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                  background: #262522;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #888;
                  border-radius: 10px;
                  border: 3px solid #262522;
              }
          `}</style>
      </>
  );
};

export default MatchPage;
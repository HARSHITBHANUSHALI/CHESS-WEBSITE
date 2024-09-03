import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import { useChess } from '../ChessContext';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MatchPage = () => {
    const { user, room, socket, opponent, inRoom, turn, grid, userSide, totalMoves, piece, letters, winner, setWinner, setOpponent } = useChess();
    const movesContainerRef = useRef(null);
    const navigate = useNavigate();
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

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
        setOpponent(null);
    };

    const handleLeaveRoom = () => {
        setShowLeaveConfirmation(true);
    };

    const confirmLeaveRoom = () => {
        socket.emit('leaveRoom', {user,room});
        setShowLeaveConfirmation(false);
        setWinner({ winnerName: opponentName }); // Assuming opponent wins when leaving
    };

    const cancelLeaveRoom = () => {
        setShowLeaveConfirmation(false);
    };

    const waitingVariants = {
        hidden: {
            opacity: 0,
            y: '-100vh'
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', damping: 40, ease: 'easeIn' }
        },
        exit: {
            x: 0,
            opacity: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    const matchVariants = {
        hidden: {
            opacity: 0,
            y: '100vh'
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', damping: 40, ease: 'easeIn' }
        }
    };

    return (
        <>
            <div className='main h-screen bg-gray-900 text-white overflow-auto'>
                <AnimatePresence mode='wait'>
                    {opponent === null && (
                        <motion.div
                            className='bg-black opacity-50 absolute h-full w-full flex justify-center items-center'
                            variants={waitingVariants}
                            key='waiting'
                            initial='hidden'
                            animate='visible'
                            exit='exit'
                        >
                            <div className='text-3xl flex flex-col gap-4 justify-center items-center w-1/3 h-1/2 bg-[#262522] rounded-xl'>
                                WAITING FOR THE OPPONENT
                                <motion.div
                                    className='rounded-full h-3 w-3 bg-white'
                                    animate={{ x: [-30, 30] }}
                                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5, ease: 'linear' }}
                                ></motion.div>
                            </div>
                        </motion.div>
                    )}

                    {opponent !== null && (
                        <motion.div
                            className='m-4'
                            variants={matchVariants}
                            key='match'
                            initial='hidden'
                            animate='visible'
                        >
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
                                            <img
                                                src={user?.photos?.length > 0 ? 'https://chess-website-zs36.onrender.com/uploads/' + user?.photos[0] : '/user.svg'}
                                                alt="User"
                                                className='w-16 h-16 p-2 rounded-full border-2 border-gray-700'
                                            />
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
                                            <img
                                                src={opponent?.photos?.length > 0 ? 'https://chess-website-zs36.onrender.com/uploads/' + opponent?.photos[0] : '/user.svg'}
                                                alt="Opponent"
                                                className='w-16 h-16 rounded-full border-2 border-gray-700 p-2'
                                            />
                                            <div>
                                                <p className='text-lg font-bold'>{opponentName}</p>
                                                <p className='text-sm text-gray-400'>{opponentSide === 1 ? 'White' : 'Black'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className='rounded-xl font-semibold p-2 overflow-hidden'
                                            onClick={handleLeaveRoom}
                                        >
                                            Leave Match
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showLeaveConfirmation && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                        <div className='bg-[rgb(28,27,25)] w-1/3 p-8 rounded-lg shadow-lg text-center'>
                            <h2 className='text-2xl font-bold mb-4'>Are you sure you want to leave?</h2>
                            <h3 className='text-2xl font-bold mb-4'>(If you leave, then opponent wins the match)</h3>
                            <div className='flex justify-around mb-4'>
                                <button
                                    onClick={confirmLeaveRoom}
                                    className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300'
                                >
                                    Yes, Leave
                                </button>
                                <button
                                    onClick={cancelLeaveRoom}
                                    className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {winner && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                        <div className='bg-[rgb(28,27,25)] w-2/5 p-8 rounded-lg shadow-lg text-center'>
                            <h2 className='text-4xl font-bold mb-4'>
                                {user.username === winner.winnerName ? 'You Win!' : `${winner.winnerName} Wins`}
                            </h2>
                            <div className='flex items-center justify-around mb-4'>
                                <div className='text-center'>
                                    <div className='flex items-center gap-4'>
                                        <img
                                            src={user?.photos?.length > 0 ? 'https://chess-website-zs36.onrender.com/uploads/' + user?.photos[0] : '/user.svg'}
                                            alt="User"
                                            className='w-16 h-16 rounded-full border-2 border-gray-700 p-2'
                                        />
                                        <p className='text-3xl'>{user.username}</p>
                                    </div>
                                </div>
                                <div className='flex text-4xl gap-4'>
                                    <div>{user.username === winner.winnerName ? '1' : '0'}</div>
                                    <p>-</p>
                                    <div>{opponentName === winner.winnerName ? '1' : '0'}</div>
                                </div>
                                <div className='text-center'>
                                    <div className='flex items-center gap-4'>
                                        <img
                                            src={opponent?.photos?.length > 0 ? 'https://chess-website-zs36.onrender.com/uploads/' + opponent?.photos[0] : '/user.svg'}
                                            alt="Opponent"
                                            className='w-16 h-16 rounded-full border-2 border-gray-700 p-2'
                                        />
                                        <p className='text-3xl'>{opponentName}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleBackToHome}
                                className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300'
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MatchPage;

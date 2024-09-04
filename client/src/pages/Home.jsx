import React, { useState } from 'react';
import { useChess } from '../ChessContext';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Home = () => {
    const { user, room, joinRoom, setRoom, socket } = useChess();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function handleJoinRoom(e) {
        e.preventDefault();
        joinRoom(room);
        navigate('/match');
    }

    return (
        <div className='main overflow-auto min-h-screen flex relative'>
            {/* Sidebar Toggle Button */}
            <button
                className='md:hidden absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full'
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <img src={isSidebarOpen ? '/sidebarclose.svg' : '/sidebaropen.svg'} alt="Toggle Sidebar" />
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-0 bg-darkgrey z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:h-screen md:w-36 md:bg-darkgrey`}>
                <div className='flex flex-col h-full p-4'>
                    <img className='w-full mb-4' src="/chesslogo.png" alt="Chess Logo" />
                    <div>
                        <Link to='/profile'>
                            <div className='flex items-center gap-x-2 mb-6'>
                                <img src="/user.svg" alt="Profile" className='w-6' />
                                <span className='text-lg font-bold'>Profile</span>
                            </div>
                        </Link>
                        <form className='flex flex-col'>
                            <input type="text" placeholder='Search' className='mb-6 rounded-lg p-2' />
                            <button className='bg-[hsl(40deg_2.56%_22.94%)] rounded-lg mb-2 p-2 border-b-2 border-[#363533] signup' onClick={() => navigate('/signup')}>Sign Up</button>
                            <button className='rounded-lg p-2 border-b-2 border-[#45753c] login' onClick={() => navigate('/login')}>Log In</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col-reverse md:flex-row transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
                <div className='w-full md:w-1/2 flex justify-center md:justify-end pt-12'>
                    <div className='w-full md:w-[75%] rounded-lg overflow-hidden'>
                        <img src="/chessboard.png" className='object-cover w-full' alt="Chessboard" />
                    </div>
                </div>
                <div className='w-full md:w-1/2 flex flex-col gap-10 items-center justify-center p-4 md:p-0'>
                    <h1 className='text-2xl md:text-5xl font-bold text-center'>
                        <span>Play CHESS</span>
                        <span> On </span>
                        <span>#1 Website!</span>
                    </h1>
                    <form className='flex flex-col gap-4 w-full max-w-md md:max-w-sm' onSubmit={handleJoinRoom}>
                        <label className='text-lg md:text-3xl mb-2'>Enter Room Name</label>
                        <input
                            type="search"
                            value={room}
                            placeholder='Room Name'
                            onChange={(e) => setRoom(e.target.value)}
                            className='border border-black rounded-xl p-2'
                            required
                        />
                        <button
                            type='submit'
                            className='h-16 md:h-20 p-4 rounded-2xl hover:bg-[#a3d160] flex gap-4 items-center text-lg md:text-2xl font-semibold font-sans joinRoom-text-shadow border-[#45753c] border-b-4'
                        >
                            <div>
                                <img src="/playchess.svg" className='w-8 md:w-12' alt="Play Chess" />
                            </div>
                            JOIN ROOM
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;

import React from 'react'
import { useChess } from '../ChessContext';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css'

const Home = () => {
    const { user,room, joinRoom, setRoom, socket } = useChess();
    const navigate = useNavigate();
    function handleJoinRoom(e) {
        e.preventDefault();
        joinRoom(room);
        navigate('/match');
    }

    return (
        <div className='main overflow-auto'>
            <div className='flex'>
                <div className='bg-darkgrey h-screen pl-2 pr-2 w-36'>
                    <div className='flex flex-col'>
                        <img className='w-full' src="/chesslogo.png" alt="" />
                        <div>
                            <Link to='/profile'>
                                <div className='flex my-4 gap-x-2'>
                                    <img src="/user.svg" className='' alt="" />
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
                <div className='flex w-full'>
                    <div className='w-1/2 flex flex-row justify-end pt-12'>
                        <div className='w-[75%] rounded-lg overflow-hidden'>
                            <img src="/chessboard.png" className='object-cover' alt="" />
                        </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-10 items-center justify-center'>
                        <h1 className='text-5xl font-bold flex flex-col justify-center items-center'>
                            <span>Play CHESS</span>
                            <span>On</span>
                            <span>#1 Website!</span>
                        </h1>
                        <form className='flex flex-col gap-2 mt-2 w-2/3' onSubmit={handleJoinRoom}>
                            <label className='text-3xl'>Enter Room Name</label>
                            <input type="search" value={room} placeholder='Room Name' onChange={(e) => setRoom(e.target.value)} className='border border-black rounded-xl p-2' required />
                            <button type='submit' className='h-20 p-4 rounded-2xl hover:bg-[#a3d160] flex gap-4 items-center text-2xl font-semibold font-sans joinRoom-text-shadow border-[#45753c] border-b-4'>
                                <div>
                                    <img src="/playchess.svg" className='w-12 joinRoom' alt="" />
                                </div>
                                JOIN ROOM
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

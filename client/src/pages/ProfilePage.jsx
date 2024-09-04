import React, { useState, useEffect } from 'react';
import { useChess } from '../ChessContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, setAddedPhoto } = useChess();
    const [games, setGames] = useState([]);
    const [stats, setStats] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!user){
            navigate('/login');
        } else {
            axios.get(`/api/users/${user._id}/games`).then(response => {
                console.log(response.data);
                setGames(response.data);
            });
            axios.get(`/stats/${user._id}`).then(({data})=>{
                console.log(data);
                setStats(data);
            });
        }
    }, [user]);

    if(!user){
        return null;
    }

    async function handleAddPhoto(e) {
        e.preventDefault();
        const files = e.target.files;
        const data = new FormData();
        data.append('photos', files[0]);
        const response = await axios.post('/uploadPhoto', data, {
            headers: {
                'Content-type': 'multipart/form-data',
                'username': user.username
            }
        });
        const filenames = response?.data;
        setAddedPhoto([filenames]);
    }

    return (
        <div className='main h-screen overflow-auto p-3 sm:p-4'>
            <div className='flex gap-2 items-center mb-4'>
                <Link to='/'>
                    <img src="/backarrow.svg" className='w-6 sm:w-10' alt="Back" />
                </Link>
                <Link to='/'>
                    <div className='text-sm sm:text-lg'>Back to Home</div>
                </Link>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4'>
                <div>
                    <div className='flex flex-col items-center sm:flex-row mt-4 p-4 sm:p-8 bg-[rgb(38,37,34)] rounded-lg'>
                        <div className='relative flex-shrink-0 mb-4 sm:mb-0'>
                            <img src={user.photos?.length > 0 ? `https://chess-website-zs36.onrender.com/uploads/${user.photos[0]}` : '/profilePic.webp'} 
                                className='w-24 h-24 sm:w-40 sm:h-40 rounded-full object-cover' alt="Profile" />
                            <label className='bg-white opacity-70 text-black flex absolute bottom-0 w-full justify-center gap-2 p-1 cursor-pointer'>
                                <input type="file" className='hidden' onChange={handleAddPhoto} />
                                <img src="/camera.svg" alt="Add" />
                                <span className='text-xs sm:text-sm'>Add</span>
                            </label>
                        </div>
                        <div className='flex flex-col justify-center text-center sm:text-left sm:ml-4'>
                            <div className='text-lg sm:text-2xl font-semibold'>{user.username}</div>
                            <div className='text-sm sm:text-lg mt-2'>Email: {user.email}</div>
                        </div>
                    </div>
                    <div className='mt-4 p-4 sm:p-8 bg-[rgb(38,37,34)] rounded-lg'>
                        <div className='text-lg sm:text-xl font-bold'>Matches Played</div>
                        <div className='mt-4'>
                            {games.map(game => (
                                <div key={game._id} className='mb-4'>
                                    <div className='flex flex-col sm:flex-row items-center px-4 py-3 gap-2 sm:gap-4 rounded-lg bg-[rgb(28,27,25)]'>
                                        <div className='w-full sm:w-3/4 text-center sm:text-left'>
                                            <div className='text-base sm:text-lg'>{user.username} vs {game.players.find(p => p.userId._id !== user._id)?.username}</div>
                                            <div className='text-sm sm:text-base'>{game.result} Won</div>
                                        </div>
                                        <button
                                            className='w-full sm:w-1/4 bg-blue-500 text-white py-1 px-4 rounded-lg mt-0 sm:mt-0'
                                            onClick={() =>navigate(`/game/${game._id}`, { state: { game } })}
                                        >
                                            View Game
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='mt-4 sm:mt-4'>
                    <div className='bg-[rgb(38,37,34)] p-4 sm:p-5 rounded-lg flex flex-col'>
                        <div className='text-lg sm:text-xl font-bold'>Stats</div>
                        <div className='h-[1px] w-full bg-white my-4'></div>
                        <div className='text-sm sm:text-base'>Games Played: {stats.gamesPlayed}</div>
                        <div className='text-sm sm:text-base'>Games Won: {stats.gamesWon}</div>
                        <div className='text-sm sm:text-base'>Games Lost: {stats.gamesLost}</div>
                        <div className='text-sm sm:text-base'>Games Drawn: {stats.gamesDrawn}</div>
                        <div className='text-sm sm:text-base'>Win/Lose Ratio: {(stats.gamesWon / (stats.gamesPlayed - stats.gamesDrawn)).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

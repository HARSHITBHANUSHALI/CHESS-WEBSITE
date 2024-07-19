import React, { useState, useEffect } from 'react';
import { useChess } from '../ChessContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, setAddedPhoto } = useChess();
    const [games, setGames] = useState([]);
    const [stats,setStats] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
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

    if (!user) {
        return <div>Loading...</div>;
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
        <div className='main h-screen overflow-auto p-2'>
            <div className='flex gap-2 items-center'>
                <Link to='/'>
                    <img src="/backarrow.svg" className='w-10' alt="" />
                </Link>
                <Link to='/'>
                    <div className='text-lg'>Back to Home</div>
                </Link>
            </div>
            <div className='grid grid-cols-[2fr_1fr]'>
                <div>
                    <div className='flex mt-4 ml-10 mr-10 p-8 bg-[rgb(38,37,34)]'>
                        <div className='relative'>
                            <img src={user.photos.length > 0 ? `http://localhost:3500/uploads/${user.photos[0]}` : '/profilePic.webp'} className='w-40' alt="" />
                            <label className='bg-white opacity-70 text-black flex absolute bottom-0 w-full justify-center gap-2'>
                                <input type="file" className='hidden' onChange={handleAddPhoto} />
                                <img src="/camera.svg" alt="" />
                                Add
                            </label>
                        </div>
                        <div className='p-4'>
                            <div className='text-2xl font-semibold'>{user.username}</div>
                            <div className='text-lg mt-2'>Email: {user.email}</div>
                        </div>
                    </div>
                    <div className='mt-4 ml-10 mr-10 p-8 bg-[rgb(38,37,34)]'>
                        <div className='text-xl font-bold'>Matches Played</div>
                        <div className='mt-4'>
                            {games.map(game => (
                                <div key={game._id} className='mb-4'>
                                    <div className='flex items-center px-4 py-2 gap-4 rounded-lg bg-[rgb(28,27,25)]'>
                                        <div className='w-3/4 text-center'>
                                            <div className='text-xl'>{user.username} vs {game.players.find(p => p.userId._id !== user._id)?.username}</div>
                                            <div>{game.result} Won</div>
                                        </div>
                                        <button
                                            className='w-1/4 bg-blue-500 text-white py-1 px-4 rounded-lg'
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
                <div>
                    <div className='bg-[rgb(38,37,34)] p-4 flex flex-col mt-4 mr-4'>
                        <div className='text-xl font-bold'>Stats</div>
                        <div className='h-[1px] w-full bg-white my-4'></div>
                        <div>Games Played: {stats.gamesPlayed}</div>
                        <div>Games Won: {stats.gamesWon}</div>
                        <div>Games Lost: {stats.gamesLost}</div>
                        <div>Games Drawn: {stats.gamesDrawn}</div>
                        <div>Win/Lose Ratio: {(stats.gamesWon / (stats.gamesPlayed - stats.gamesDrawn)).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

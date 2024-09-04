import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('/signup', { username, email, password });
            if (response) {
                alert('Account Created Successfully.');
                setUsername('');
                setEmail('');
                setPassword('');
                navigate('/login');
            }
        } catch (err) {
            console.log(err);
            alert('Account creation failed. Username or Email might already exist.');
        }
    }

    return (
        <div className='main h-screen flex flex-col items-center'>
            <div className='flex gap-2 items-center z-20 absolute left-2 top-2'>
                <Link to='/'>
                    <img src="/backarrow.svg" className='w-10 z-20 md:w-10' alt="" />
                </Link>
                <Link to='/'>
                    <div className='text-sm md:text-lg z-20'>Back to Home</div>
                </Link>
            </div>
            <img src="/background.png" className='h-full w-full fixed object-cover' alt="" />
            <div className='w-5/6 sm:w-2/3 md:w-1/2 lg:w-1/3 flex flex-col items-center z-10'>
                <img src="/chesslogo.png" className='w-2/6 md:w-1/6' alt="" />
                {!showForm && (
                    <>
                        <h1 className='text-3xl md:text-4xl font-bold text-center'>Create Your Chess Account!</h1>
                        <img src="/pawnonboard.svg" className='w-2/4 my-2' alt="" />
                        <button className='rounded-lg py-4 border-b-4 border-[#45753c] login w-full leading-6 text-lg md:text-2xl font-extrabold font-[Montserrat,sans-serif]' onClick={() => setShowForm(true)}>Sign Up</button>
                        <span>Already have an Account? <Link to='/login' className='underline hover:text-green'>Log In</Link></span>
                    </>
                )}
                {showForm && (
                    <>
                        <h1 className='text-3xl md:text-4xl font-bold text-center'>Enter Your Email and a Password</h1>
                        <form className='mt-4 flex flex-col gap-6 w-full' onSubmit={handleSubmit}>
                            <div className='flex bg-[rgb(60,59,57)] gap-4 rounded-xl overflow-hidden px-4 hover:outline focus-within:outline outline-1 outline-slate-200'>
                                <img src="/user.svg" alt="" />
                                <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className='h-14 w-full outline-none' />
                            </div>
                            <div className='flex bg-[rgb(60,59,57)] gap-4 rounded-xl overflow-hidden px-4 hover:outline focus-within:outline outline-1 outline-slate-200'>
                                <img src="/email.svg" alt="" />
                                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='h-14 w-full outline-none' />
                            </div>
                            <div className='flex bg-[rgb(60,59,57)] gap-4 rounded-xl overflow-hidden px-4 mb-8 hover:outline focus-within:outline outline-1 outline-slate-200'>
                                <img src="/password.svg" alt="" />
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='h-14 w-full outline-none' />
                                <img
                                    src={showPassword ? '/closeEye.svg' : '/eye.svg'}
                                    onClick={togglePasswordVisibility}
                                    className='cursor-pointer'
                                    aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                                    alt="" />
                            </div>
                            <button type='submit' className='rounded-lg py-4 border-b-4 border-[#45753c] login w-full leading-6 text-lg md:text-2xl font-extrabold font-[Montserrat,sans-serif]'>Continue</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default SignupPage

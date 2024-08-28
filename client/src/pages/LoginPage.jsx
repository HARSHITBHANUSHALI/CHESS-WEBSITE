import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useChess } from '../ChessContext';

const LoginPage = () => {
    const {user,setUser,isLoggedIn,setIsLoggedIn} = useChess();
    const [username,setUsername]=useState('');
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    const [showPassword,setShowPassword] = useState(false);
    const [password,setPassword] = useState('');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const navigate = useNavigate();
    
    async function handleSubmit(e){
        e.preventDefault();
        try{
           const response = await axios.post('/login',{username,password});
           console.log(response.data);
           setUser(response.data);
           alert('Login Successful');
           navigate('/');
           setIsLoggedIn(true);
           sessionStorage.setItem('isLoggedIn', 'true');
        }catch(err){
            console.error(err);
            alert('Login Failed');
        }
    }
  
    const handleLogout = ()=>{
      setUser(null);
      setIsLoggedIn(false);
      localStorage.clear();
      sessionStorage.removeItem('isLoggedIn');
      axios.post('/logout');
      navigate('/login');
    }
  return (
    
    <div className='main h-screen flex flex-col items-center'>
      <div className='flex gap-2 items-center z-20 absolute left-2 top-2'>
          <Link to='/'>
              <img src="/backarrow.svg" className='w-10 z-20' alt="" />
          </Link>
          <Link to='/'>
              <div className='text-lg z-20'>Back to Home</div>
          </Link>
      </div>
      <img src="/background.png" className='h-full w-full fixed' alt="" />
      <img src="/chesslogo.png" className='w-1/6' alt="" />
      {(isLoggedIn||loggedIn)?(<>
          <div className='flex flex-col justify-between bg-[#262421] z-10 rounded-xl w-1/4 h-1/3 overflow-hidden p-5 text-center'>
              <div className='text-5xl font-ams'>
                <div>Hey!!!</div>
                <div>Your are Logged In!</div>
              </div>
              <span className='text-3xl '></span>
              <button onClick={handleLogout} className='rounded-lg py-4 border-b-4 border-[#45753c] login w-full leading-6 text-2xl font-extrabold font-[Montserrat,sans-serif]'>Log Out</button>
          </div>
          </>
        ):(        
        <div className='bg-[#262421] z-10 rounded-xl w-1/4 overflow-hidden'>
          <form className='flex flex-col gap-6 mx-8 my-20' onSubmit={handleSubmit}>
              <div className='flex bg-[rgb(60,59,57)] gap-4 rounded-xl overflow-hidden px-4 hover:outline focus-within:outline outline-1 outline-slate-200'>
                  <img src="/user.svg" alt="" />
                  <input type="text" placeholder='Username or Email' value={username} onChange={(e)=>setUsername(e.target.value)} className='h-14 w-full outline-none'/>
              </div>
              <div className='flex bg-[rgb(60,59,57)] gap-4 rounded-xl overflow-hidden px-4 mb-8 hover:outline focus-within:outline outline-1 outline-slate-200'>
                  <img src="/password.svg" alt="" />
                  
                  <input 
                      type={showPassword?'text':'password'} 
                      placeholder='Password' value={password} 
                      onChange={(e)=>setPassword(e.target.value)} 
                      className='h-14 w-full outline-none'/>
                  <img 
                      src={showPassword?'/closeEye.svg':'/eye.svg'} 
                      onClick={togglePasswordVisibility} 
                      className='cursor-pointer' 
                      aria-label={showPassword?'Hide Password':'Show Password'}
                      alt="" />
                      
              </div>
              <button className='rounded-lg py-4 border-b-4 border-[#45753c] login w-full leading-6 text-2xl font-extrabold font-[Montserrat,sans-serif]'>Log In</button>
          </form>
          <div className='bg-[#211f1c] w-full text-center p-4'>
              <span className='opacity-85 hover:opacity-100'>
                New? <Link to='/signup' className='cursor-pointer'> Sign up - and start playing Chess!</Link>
              </span>
          </div>
        </div>)
      }
    </div>
  )
}

export default LoginPage

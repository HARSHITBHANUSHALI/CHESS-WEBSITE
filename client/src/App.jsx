import { useEffect, useState } from 'react';
import './index.css';
import io from 'socket.io-client';
import ChessBoard from './components/ChessBoard';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import MatchPage from './pages/MatchPage';
import { ChessProvider } from './ChessContext';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ViewGamePage from './pages/ViewGamePage';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3500";
axios.defaults.withCredentials = true;

function App() {
  return (
    <ChessProvider>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/match' element={<MatchPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/game/:id' element={<ViewGamePage />} />
      </Routes>
    </ChessProvider>
  );
}

export default App;

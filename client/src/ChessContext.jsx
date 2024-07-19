import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const ChessContext = createContext();
export const useChess = () => useContext(ChessContext);

export const ChessProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [ready, setReady] = useState(false);

    const [chatMsg, setChatMsg] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [board, setBoard] = useState(null);
    const [room, setRoom] = useState('');
    const [inRoom, setInRoom] = useState(false);
    const [userSide, setUserSide] = useState(null);
    const [turn, setTurn] = useState(1);
    const [lock, setLock] = useState(false);
    const [totalMoves, setTotalMoves] = useState([]);
    const [addedPhoto, setAddedPhoto] = useState([]);
    const [grid, setGrid] = useState([
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ]);

    const [winner, setWinner] = useState(null);

    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const piece = (cell) => {
        const pieces = {
            'br': '/br.png',
            'bn': '/bn.png',
            'bb': '/bb.png',
            'bq': '/bq.png',
            'bk': '/bk.png',
            'bp': '/bp.png',
            'wr': '/wr.png',
            'wn': '/wn.png',
            'wb': '/wb.png',
            'wq': '/wq.png',
            'wk': '/wk.png',
            'wp': '/wp.png'
        };
        return pieces[cell] || '';
    };

    useEffect(() => {
        const newSocket = io('http://localhost:3500');
        setSocket(newSocket);

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setReady(true);
        } else {
            axios.get('/profile').then(({ data }) => {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                setReady(true);
            });
        }

        newSocket.on('message', (msg) => {
            console.log(msg);
            setMessage(msg);
        });

        newSocket.on('roomJoined', ({ success, message, room, userSide,noOfUsers }) => {
            if (success) {
                setInRoom(true);
                setUserSide(userSide);
                if(noOfUsers===2){
                  setLock(false);
                }
                console.log(`Successfully joined Room: ${room} with userSide ${userSide}`);
            } else {
                alert(message);
                console.log(`Failed to join Room: ${message}`);
            }
        });

        newSocket.on('grid', ({ grid, turn, win, move }) => {
            setGrid(grid);
            setTotalMoves(prevTotalMoves => [...prevTotalMoves, move]);
            setTurn(turn);
            console.log(totalMoves);
            if (win === 1 || win === 0) {
                setLock(true);
            }
        });

        newSocket.on('OpponentDetails', ({ user, socketId }) => {
            setOpponent(user);
            setLock(false);
            console.log(lock);
        });

        newSocket.on('chatMsg', (data) => {
            const {name,text,time} = data; 
            setChatMessages((prevMessages) => [...prevMessages, {name,text,time}]);
        });
      
        newSocket.on('activity', (name) => {
        setActivity(name ? `${name} is typing...` : null);
        });

        newSocket.on('gameOver', (data) => {
            setWinner(data);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const updateUser = (newUser) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const joinRoom = (room) => {
        if (!socket || !user) return;

        socket.emit('joinRoom', { user: { userId: user._id.toString() }, room });
    };

    return (
        <ChessContext.Provider value={{
            user, setUser: updateUser, opponent, addedPhoto, setAddedPhoto, ready,
            socket, message, board, setBoard, room, setRoom, joinRoom,
            inRoom, userSide, turn, setTurn, lock, setLock,
            totalMoves, setTotalMoves, grid, setGrid, setUserSide, letters, piece,
            chatMsg,setChatMsg,chatMessages,setChatMessages, winner, setWinner
        }}>
            {children}
        </ChessContext.Provider>
    );
};

import React, { useEffect, useRef, useState } from 'react';
import { useChess } from '../ChessContext';

const Chat = () => {
    const { user, room, socket, chatMsg, setChatMsg, chatMessages, setChatMessages } = useChess();
    const [activity, setActivity] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    function sendMessage(e) {
        e.preventDefault();
        if (chatMsg && user.username && room) {
            socket.emit('chatMsg', {
                "username": user.username,
                "message": chatMsg,
                room
            });
            setChatMsg('');
            setActivity(null);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                setTypingTimeout(null);
            }
        }
    }

    function handleTyping(e) {
        setChatMsg(e.target.value);

        if (socket && user.username && room) {
            socket.emit('activity', { name: user.username, room });

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            setTypingTimeout(setTimeout(() => {
                socket.emit('activity', null);
            }, 3000));
        }
    }

    function listClass(msg) {
        if (msg.name === user.username)
            return "post post--left";
        else if (msg.name !== user.username && msg.name !== 'Admin')
            return "post post--right";
        else if (msg.name !== 'Admin')
            return "post post--left";
        else
            return "post";
    }

    function messageClass(msg) {
        if (msg.name === user.username)
            return { backgroundColor: '#4CAF50' }; // Sender (Green)
        else
            return { backgroundColor: '#2196F3' }; // Receiver (Blue)
    }

    function messageDisplay(msg, index) {
        if (msg.name !== 'Admin') {
            return (
                <li className={`${listClass(msg)}`} key={index}>
                    <div className={`post__header`} style={messageClass(msg)}>
                        <span className='post__header--name'>{msg.name}</span>
                        <span className='post__header--time'>{msg.time}</span>
                    </div>
                    <div className='post__text'>
                        {msg.text}
                    </div>
                </li>
            )
        } else {
            return (
                <li className={`${listClass(msg)}`} key={index}>
                    <div className={`post__text`}>
                        {msg.text}
                    </div>
                </li>
            )
        }
    }

    return (
        <>
            <div className='flex justify-center flex-grow w-full rounded-lg my-4 mx-2 bg-[#262522] overflow-hidden shadow-lg'>
                <main className='relative w-full h-full flex flex-col items-center'>
                    <div className='bg-[#1c1b19] w-full text-center py-4 shadow-md'>
                        <h1 className='text-2xl text-white font-semibold'>CHAT</h1>
                    </div>

                    <div ref={chatContainerRef} className='flex-grow w-full px-4 overflow-auto bg-[#2b2a28] shadow-inner max-h-[70vh] custom-scrollbar' id='chat-container'>
                        <ul className='chat-display space-y-4 py-4'>
                            {chatMessages.length > 0 &&
                                chatMessages.map((msg, index) => (
                                    messageDisplay(msg, index)
                                ))}
                        </ul>
                    </div>

                    {activity && <p className='text-gray-400 my-2'>{activity}</p>}
                    <form className='form-msg w-full p-4 flex gap-2 bg-[#1c1b19] rounded-b-xl shadow-md' onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={chatMsg}
                            onChange={handleTyping}
                            placeholder="Your message"
                            required
                            className='rounded-xl px-3 py-2 bg-[#2b2a28e6] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow'
                        />
                        <button type="submit" className='rounded-xl px-4 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300'>Send</button>
                    </form>
                </main>
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
}

export default Chat;


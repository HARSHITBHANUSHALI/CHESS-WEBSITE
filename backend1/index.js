require('dotenv').config();
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const credentials = require('./middleware/credentials');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');

// Import Schemas
const User = require('./models/User');
const Game = require('./models/Game');
const Room = require('./models/Room');

connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());

app.use(express.json());
app.use('/signup', require('./routes/register'));
app.use('/login', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));
app.use('/profile', require('./routes/profile'));
app.use('/uploadPhoto', require('./routes/uploadPhoto'));
app.use('/api', require('./routes/games'));
app.use('/stats',require('./routes/stats'));

// Room Manager
const roomManager = {
    rooms: {},

    async addUserToRoom(roomName, user) {
        try {
            let room = await Room.findOne({ roomId: roomName }).populate('players.userId');
            if (!room) {
                room = new Room({ roomId: roomName, players: [], game: null });
            }

            const existingPlayer = room.players.find(p => p.userId.toString() === user._id.toString());
            if (!existingPlayer) {
                room.players.push({
                    userId: user._id,
                    socketId: user.socketId,
                    username: user.username
                });
            }

            room.updatedAt = Date.now();
            await room.save();
            this.rooms[roomName] = room;
        } catch (error) {
            console.error('Error adding user to room:', error);
            throw error;
        }
    },

    async removeUserFromRoom(roomName, userId) {
        try {
            let room = await Room.findOne({ roomId: roomName }).populate('players.userId');
            if (room) {
                room.players = room.players.filter(p => p.userId.toString() !== userId.toString());
                if (room.players.length === 0) {
                    delete this.rooms[roomName];
                    await Room.deleteOne({ roomId: roomName });
                    console.log(`Room ${roomName} deleted because it is empty.`);
                } else {
                    room.updatedAt = Date.now();
                    await room.save();
                    this.rooms[roomName] = room;

                }
            }
        } catch (error) {
            console.error('Error removing user from room:', error);
            throw error;
        }
    },

    getRoomUsers(roomName) {
        const room = this.rooms[roomName];
        return room ? room.players.map(p => ({ _id: p.userId, socketId: p.socketId, username: p.username })) : [];
    },

    getOpponent(roomName, username) {
        const room = this.rooms[roomName];
        if (room) {
            return room.players.find(p => p.username !== username);
        }
        return null;
    }
};

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    const expressServer = app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

    const io = new Server(expressServer, {
        cors: {
            credentials: true,
            origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"]
        }
    });

    io.on('connection', socket => {
        socket.emit('message', 'Socket connected.');
        console.log(`User ${socket.id} connected`);

        socket.on('joinRoom', async ({ user, room }) => {
            try {
                if (!room) {
                    socket.emit('roomJoined', {
                        success: false,
                        message: "Room name is required"
                    });
                    return;
                }

                const dbUser = await User.findById(user.userId);
                if (!dbUser) {
                    socket.emit('roomJoined', {
                        success: false,
                        message: "User not found"
                    });
                    return;
                }

                dbUser.socketId = socket.id;
                dbUser.room = room;
                await dbUser.save();

                await roomManager.addUserToRoom(room, dbUser);
                socket.join(room);

                const roomUsers = roomManager.getRoomUsers(room);
                let userSide = 0;
                let noOfUsers = 1;

                if (roomUsers.length === 1) {
                    userSide = 1;
                } else if (roomUsers.length === 2) {
                    noOfUsers = 2;
                }

                socket.emit('roomJoined', {
                    success: true,
                    room,
                    userSide,
                    noOfUsers
                });

                const opponent = roomManager.getOpponent(room, dbUser.username);
                if (opponent) {
                    socket.to(opponent.socketId).emit('OpponentDetails', { user: dbUser });
                    socket.emit('OpponentDetails', { user: opponent });
                } else {
                    socket.emit('OpponentDetails', { user: null });
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('roomJoined', {
                    success: false,
                    message: "An error occurred while joining the room"
                });
            }
        });

        socket.on('grid', async ({ grid, turn, win, move }) => {
            try {
                const user = await User.findOne({ socketId: socket.id }).exec();
                if (user) {
                    const room = user.room;
                    const roomDoc = await Room.findOne({ roomId: room }).exec();
                    if (roomDoc) {
                        let gameDoc;
                        if (!roomDoc.game) {
                            gameDoc = new Game({
                                players: roomDoc.players.map(p => ({
                                    userId: p.userId,
                                    username: p.username
                                })),
                                gameState: JSON.stringify(grid),
                                moves: [move]
                            });
                            roomDoc.game = gameDoc._id;
                            await roomDoc.save();
                            await gameDoc.save();
                        } else {
                            gameDoc = await Game.findByIdAndUpdate(
                                roomDoc.game,
                                { $push: { moves: move }, gameState: JSON.stringify(grid) },
                                { new: true }
                            );
                        }
                        socket.broadcast.to(room).emit('grid', { grid, turn, win, move });
                        console.log(`Grid updated in room ${room}`);
                    }
                } else {
                    console.error('User not found for socket id:', socket.id);
                }
            } catch (error) {
                console.error('Error broadcasting grid:', error);
            }
        });

        socket.on('OpponentDetails', async ({ user }) => {
            const currentUser = await User.findOne({ socketId: socket.id });
            const room = currentUser.room;
            socket.broadcast.to(room).emit('OpponentDetails', { user });
        });

        socket.on('chatMsg', ({ username, message, room }) => {
            if (room) {
                io.to(room).emit('chatMsg', buildMsg(username, message));
            }
            socket.broadcast.emit('activity', null);
        });

        socket.on('activity', ({ name, room }) => {
            if (room) {
                socket.broadcast.to(room).emit('activity', name);
            }
        });

        socket.on('gameFinish', async ({ user, room }) => {
            try {
                const roomDoc = await Room.findOne({ roomId: room }).populate('players.userId');
                if (roomDoc) {
                    const opponent = roomManager.getOpponent(room, user.username);
                    if (opponent) {
                        const winner = {
                            winnerName: user.username,
                            winnerPhoto: user.photos?.length > 0 ? 'http://localhost:3500/uploads/' + user.photos[0] : '/user.svg',
                            loserName: opponent.username,
                            loserPhoto: opponent.photos?.length > 0 ? 'http://localhost:3500/uploads/' + opponent.photos[0] : '/user.svg'
                        };

                        io.to(room).emit('gameOver', winner);

                        let result;
                        if (user.username === winner.winnerName) {
                            result = user.username;
                        } else {
                            result = opponent.username;
                        }

                        const gameDoc = await Game.findById(roomDoc.game);
                        if (gameDoc) {
                            gameDoc.result = result;
                            await gameDoc.save();

                            const player1 = await User.findById(gameDoc.players[0].userId);
                            const player2 = await User.findById(gameDoc.players[1].userId);
                            if (result === player1.username) {
                                player1.stats.gamesWon += 1;
                                player2.stats.gamesLost += 1;
                            } else if (result === player2.username) {
                                player1.stats.gamesLost += 1;
                                player2.stats.gamesWon += 1;
                            } else if (result === 'draw') {
                                player1.stats.gamesDrawn += 1;
                                player2.stats.gamesDrawn += 1;
                            }
                            player1.stats.gamesPlayed += 1;
                            player2.stats.gamesPlayed += 1;
                            player1.games.push(gameDoc._id);
                            player2.games.push(gameDoc._id);
                            await player1.save();
                            await player2.save();
                        }
                    }
                    await roomManager.removeUserFromRoom(room, user._id.toString());
                    socket.leave(room);

                    await Room.deleteOne({ roomId: room });
                    delete roomManager.rooms[room];
                    console.log(`Room ${room} deleted after user left.`);
                }
            } catch (error) {
                console.error('Error leaving room:', error);
            }
        });

        socket.on('leaveRoom', async ({ user, room }) => {
            try {
                const roomDoc = await Room.findOne({ roomId: room }).populate('players.userId');
                if (roomDoc) {
                    const opponent = roomManager.getOpponent(room, user.username);
                    if (opponent) {
                        const winner = {
                            winnerName: opponent.username,
                            winnerPhoto: opponent.photos?.length > 0 ? 'http://localhost:3500/uploads/' + opponent.photos[0] : '/user.svg',
                            loserName: user.username,
                            loserPhoto: user.photos?.length > 0 ? 'http://localhost:3500/uploads/' + user.photos[0] : '/user.svg'
                        };

                        io.to(room).emit('gameOver', winner);
                    }
                    await roomManager.removeUserFromRoom(room, user._id.toString());
                    socket.leave(room);

                    await Room.deleteOne({ roomId: room });
                    delete roomManager.rooms[room];
                    console.log(`Room ${room} deleted after user left.`);
                }
            } catch (error) {
                console.error('Error leaving room:', error);
            }
        });

        socket.on('disconnect', async () => {
            try {
                const user = await User.findOne({ socketId: socket.id });
                if (user) {
                    await roomManager.removeUserFromRoom(user.room, user._id.toString());
                    console.log(`User ${user.username} left the app.`);
                } else {
                    console.error('User not found for socket id:', socket.id);
                }
            } catch (error) {
                console.error('Error during disconnect:', error);
            }
        });
    });
});

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    };
}

mongoose.connection.on('error', err => {
    console.error(`Mongoose connection error: ${err}`);
});

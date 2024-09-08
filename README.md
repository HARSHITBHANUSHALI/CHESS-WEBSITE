# Chess Website ♟️

Welcome to the **Chess Website** project! This web-based multiplayer chess game allows players to join or create rooms, play live matches, and view match statistics. Built using **React**, **Socket.IO**, and **Express**, this application provides a seamless real-time gaming experience.
### Project Live At: https://chess-website-one.vercel.app/


## Features ✨

- **Real-time Multiplayer**: Play chess against other players in real time using Socket.IO.
- **In-Game Chat**: Chat with your opponent during the game.
- **Player Profiles**: Registered users can view their profile, including past matches and stats.
- **Personalised Avatar**: Upload your favourite avatar as your profile picture.
- **Room Management**: Create or join rooms and play matches in a competitive environment.
- **Move History**: View the complete history of moves for a match.
- **Responsive Design**: Enjoy the chess game on different devices, from desktops to mobile phones.

## Technologies Used 🛠️

- **Frontend**: ReactJS, Tailwind CSS for responsive UI
- **Backend**: Node.js, Express.js, MongoDB for user data and game state storage
- **Real-time Communication**: Socket.IO for handling game rooms and real-time updates
- **Database**: MongoDB for storing user profiles, matches, and game statistics
- **Authentication**: JWT (JSON Web Tokens) for secure user login

## Project Structure 🗂️

```bash
Chess-Website/
├── backend1/                # Backend folder
│   ├── config/              # Configuration files (DB, environment)
│   ├── controllers/         # Logic for chess game, user auth
│   ├── models/              # MongoDB schemas (User, Game)
│   └── routes/              # API endpoints (user, game)
├── client/                  # Frontend folder
│   ├── public/              # Public assets (index.html, favicon)
│   ├── src/                 # Main React application
│   │   ├── components/      # UI components (board, pieces)
│   │   ├── pages/           # Pages (Home, Match, Profile)
│   │   ├── context/         # Chess and user context (game state)
│   │   └── App.js           # Main React component
└── README.md                # Project documentation
```

## Getting Started 🚀

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:

- Node.js (v14+)
- MongoDB

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HARSHITBHANUSHALI/CHESS-WEBSITE.git
   cd CHESS-WEBSITE
   ```

2. **Install dependencies** for both the client and server:
   ```bash
   # Install server dependencies
   cd backend1
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Variables**:
Create a .env file in the backend1/ directory and add:

```bash
MONGO_URI=your_mongo_db_connection_string
REFRESH_TOKEN_SECRET=your_jwt_secret
```

4. **Run the application**:
   ```bash
   # Start the server
   cd server
   npm start

   # Start the client
   cd ../client
   npm start
   ```

5. **Open your browser** and navigate to:
   ```bash
   http://localhost:5173
   ```

## Usage 🕹️

- Create or join a game room by entering a unique room ID.
- Play against your opponent with real-time move updates.
- Chat with you opponent during the game.
- View match history, and analyze the game using the move history panel.


## Future Enhancements 🚀

- **AI Opponent**: Implement an AI to allow users to play against a computer.
- **Game Replay**: View replays of completed matches.
- **Leaderboard**: Display the top players and their stats.

## Contact 📧

For any questions or suggestions, feel free to reach out at:
- **GitHub**: [HARSHITBHANUSHALI](https://github.com/HARSHITBHANUSHALI)
- **Email**: bhanuharshit04@gmail.com

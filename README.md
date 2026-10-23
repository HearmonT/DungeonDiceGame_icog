Dungeon Dice Game 🎲

A full-stack, browser-based RPG battle game where players pit their characters against computer-generated enemies. Built with a clean 4-layer architecture, custom authentication, and dynamic game logic.

🎮 Game Rules & Logic

Character Stats: Every character (both player and enemy) has three core attributes:

Max Attack Power

Max Defense Power

Health Points (HP)

The Battle: The game is currently Player vs. Environment (PvE).

Rolling the Dice: Each round, both characters randomly generate their actual Attack and Defense power for that specific turn, constrained within their maximum limits.

Damage Calculation: We calculate the difference between the opponent's Attack Power and your Defense Power. If their attack is higher than your defense, you take the difference as damage, which is subtracted from your HP (and vice versa).

Winning: The first player to reach 0 HP loses. If both hit 0 at the same time, it's a draw!

🏗️ Architecture

This application is built using a strict 4-layer architecture to ensure maintainability and separation of concerns:

Frontend Layer (Presentation): Built with HTML, CSS, and vanilla JavaScript. Handles the UI, user interactions, and event listeners that trigger HTTP requests to the backend.

Domain Layer (Game Engine): The core of the application. Contains all the isolated game logic, rules, and math calculations for each round.

Router Layer (API/Backend): Built with Node.js and Express.js. Acts as the traffic controller, receiving HTTP requests from the frontend, invoking the Domain layer for logic processing, and sending back the appropriate responses.

Database Layer (Persistence): Powered by SQLite. Handles all data storage, fetching, and user tracking.

🛠️ Tech Stack

Frontend: HTML5, CSS3, JavaScript (ES6+)

Backend: Node.js, Express.js

Database: SQLite

Security & Auth: bcrypt (for password hashing), Custom Session Management

🔐 Security & Features

Custom Authentication: User passwords are securely hashed using bcrypt before being stored in the database, protecting user data even in the event of a breach.

Session & Guest Management: Features a dynamic session management system. Unauthenticated users are assigned a generic guest ID, while registered users have their specific historical data and sessions securely tracked via their unique user IDs.

🚀 Installation & Setup

Clone the repository:

git clone https://github.com/yourusername/dungeon-dice.git


Navigate to the project directory:

cd dungeon-dice


Install the required backend dependencies:

npm install


Start the server:

npm start


Open your browser and navigate to http://localhost:3000 (or your configured port).

👨‍💻 Author

Herman Tesfaye
Software Engineering Student, Addis Ababa University

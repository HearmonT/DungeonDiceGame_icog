
import express from 'express';
import diceGameRoutes from './routes/diceGameRoutes.js';
import session from 'express-session';




const app = express();
const PORT = 3000;

// Parse incoming JSON request bodies.
app.use(express.json());

// Serve frontend files from the public folder.
app.use(express.static('public'));

app.use(session({
    secret: 'dungeon-dice-secret-key', // Signs the cookie so it can't be tampered with
    resave: false,
    saveUninitialized: true
}));

// Mount the game API routes under /api.
app.use('/api', diceGameRoutes);

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


import express from 'express';
import diceGameRoutes from './routes/diceGameRoutes.js';

const app = express();
const PORT = 3000;

// Parse incoming JSON request bodies.
app.use(express.json());

// Serve frontend files from the public folder.
app.use(express.static('public'));

// Mount the game API routes under /api.
app.use('/api', diceGameRoutes);

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import express from 'express';
import { heroes } from '../data/heroes.js';
import { createDiceGameEngine } from '../domain/diceGameEngine.js';

// 1. Inject the heroes data into the engine
const engine = createDiceGameEngine(heroes);
const diceGameRoutes = express.Router();

// 2. Handle GET requests to /api/heroes
diceGameRoutes.get('/heroes', (req, res) => {
    const allHeroes = engine.getHeroes();
    res.status(200).json({ heroes: allHeroes });
});

export default diceGameRoutes;
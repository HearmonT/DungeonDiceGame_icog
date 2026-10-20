import express from 'express';
import { getAllHeroes } from '../db/heroes.js';
import { createDiceGameEngine } from '../domain/diceGameEngine.js';

const heroes = await getAllHeroes();

// 1. Inject the heroes data into the engine
const engine = createDiceGameEngine(heroes);
const diceGameRoutes = express.Router();

// 2. Handle GET requests to /api/heroes
diceGameRoutes.get('/heroes', (req, res) => {
    const allHeroes = engine.getHeroes();
    res.status(200).json({ heroes: allHeroes });
});

// Handle POST requests to start a battle
diceGameRoutes.post('/battle/start', (req, res) => {
    // Extract the heroId from the incoming JSON body
    const { heroId } = req.body;

    // 1. Validation: Reject the request if no heroId is provided
    if (!heroId) {
        return res.status(400).json({ message: "Hero ID is required" });
    }

    // 2. Update engine state: Start the battle
    const battleState = engine.startBattle(heroId);

    // 3. Respond exactly as the frontend API contract expects
    res.status(200).json({
        ...battleState,
        message: "Battle started. Roll to attack!"
    });
});

// Handle POST requests to play a single round
diceGameRoutes.post('/battle/round', (req, res) => {
    // 1. Tell the engine to calculate the round
    const roundResult = engine.playRound();

    // 2. Send the entire result object directly back to the frontend
    res.status(200).json(roundResult);
});

diceGameRoutes.post('/battle/reset', (req, res) => {
    engine.resetBattle();
    res.status(200).json({ message: "Battle reset." });
});  

export default diceGameRoutes;
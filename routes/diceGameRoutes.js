import express from 'express';
import { getAllHeroes } from '../db/heroes.js';
import { createDiceGameEngine } from '../domain/diceGameEngine.js';
import { createRun, updateRunStats } from '../db/runs.js';

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
diceGameRoutes.post('/battle/start', async (req, res) => {
    const { heroId } = req.body;

    if (!heroId) {
        return res.status(400).json({ message: "Hero ID is required" });
    }

    // Epic 3: Use the logged-in user's ID, or fallback to 1 (Guest)
    const currentUserId = req.session.userId || 1;
    
    // Create the run using the correct ID and save the runId to the session
    req.session.runId = await createRun(currentUserId);

    const battleState = engine.startBattle(heroId);

    res.status(200).json({
        ...battleState,
        message: "Battle started. Roll to attack!"
    });
});


// Handle POST requests to play a single round
diceGameRoutes.post('/battle/round', async (req, res) => { // <-- Note the 'async' here
    const roundResult = engine.playRound();

    // Epic 2: If the battle is over, update the run stats in the database
    if (roundResult.outcome !== 'ongoing') {
        await updateRunStats(req.session.runId, roundResult.outcome);
    }

    res.status(200).json(roundResult);
});
diceGameRoutes.post('/battle/reset', (req, res) => {
    engine.resetBattle();
    res.status(200).json({ message: "Battle reset." });
});  

export default diceGameRoutes;
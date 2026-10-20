import express from 'express';
import { heroes } from '../data/heroes.js';
import { createDiceGameEngine } from '../domain/diceGameEngine.js'

const engine = createDiceGameEngine();
 const diceGameRoutes = express.Router();
export default diceGameRoutes;

import express from 'express';
import { getDb } from '../db/db.js';

const meRouter = express.Router();

meRouter.get('/', async (req, res) => {
    // 1. Check if the user is a guest or not logged in.
    // Remember: Epic 2 uses userId 1 for guests.
    if (!req.session.userId || req.session.userId === 1) {
        return res.status(200).json({ isLoggedIn: false });
    }

    try {
        const db = await getDb();
        
        // 2. Fetch the user from the 'users' table using their req.session.userId
        // HINT: Use db.get() with a SELECT query and a parameterized array [req.session.userId]
        const user = await db.get(`SELECT * FROM users WHERE id = ?`, [req.session.userId]);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("ME ROUTE: Fetched user:", user);

        // 3. Respond with a 200 status and the JSON: { isLoggedIn: true, name: user.name }
        res.status(200).json({ isLoggedIn: true, name: user.name });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
meRouter.get('/stats', async (req, res) => {
    // 1. Auth check: reject guests and unauthenticated requests
    if (!req.session.userId || req.session.userId === 1) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const db = await getDb();
        
        // 2. Fetch the aggregated stats for the logged-in user
        // HINT: Use db.get() with the SQL query:
        // SELECT SUM(total_battles) AS totalBattles, SUM(wins) AS totalWins, 
        // SUM(losses) AS totalLosses, MAX(wins) AS bestRun 
        // FROM runs WHERE user_id = ?
        
        // const stats = await db.get( ... );
        const stats = await db.get(
            `SELECT SUM(total_battles) AS totalBattles, SUM(wins) AS totalWins, 
             SUM(losses) AS totalLosses, MAX(wins) AS bestRun 
             FROM runs WHERE user_id = ?`,
            [req.session.userId]
        );
        console.log("ME ROUTE: Fetched stats:", stats);
        
        // 3. Return the stats with a 200 status code
        res.status(200).json(stats);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default meRouter;
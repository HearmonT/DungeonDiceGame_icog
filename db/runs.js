import { getDb } from './db.js';
export async function createRun(userId) {
    const db = await getDb();
    const result = await db.run(
        `INSERT INTO runs (user_id, total_battles, wins, losses) 
         VALUES (?, 0, 0, 0)`,
        [userId]
    );
    await db.close();
    return result.lastID; // Return the ID of the newly created run 
    
} 
export async function updateRunStats(runId, outcome) {
    const db = await getDb();
    
    // We always increment total_battles. We only increment wins or losses if applicable.
    let query = `UPDATE runs SET total_battles = total_battles + 1`;
    
    if (outcome === 'player_win') {
        query += `, wins = wins + 1`;
    } else if (outcome === 'player_loss') {
        query += `, losses = losses + 1`;
    }
    
    // Add the WHERE clause so we only update the specific run
    query += ` WHERE id = ?`;
    
    await db.run(query, [runId]);
    await db.close();
}
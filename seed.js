import { getDb } from './db/db.js';
import { heroes } from './data/heroes.js';

async function seedDatabase() {
    // 1. Open the database connection
    const db = await getDb();

    console.log('Creating heroes table...');
    // 2. Create the table if it doesn't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS heroes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            attackPower INTEGER NOT NULL,
            defensePower INTEGER NOT NULL,
            maxHp INTEGER NOT NULL,
            imageUrl TEXT NOT NULL
        )
    `);

    console.log('Creating runs table...');
    await db.exec(`
        CREATE TABLE IF NOT EXISTS runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_battles INTEGER DEFAULT 0,
            wins INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ---> ADD THIS NEW BLOCK RIGHT HERE <---
    console.log('Creating users table...');
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Clearing old data...');
    await db.exec('DELETE FROM heroes');

    console.log('Inserting heroes...');
    // 3. Loop through our hard-coded array and insert each hero into the database
    for (const hero of heroes) {
        await db.run(
            `INSERT INTO heroes (id, name, attackPower, defensePower, maxHp, imageUrl) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [hero.id, hero.name, hero.attackPower, hero.defensePower, hero.maxHp, hero.imageUrl]
        );
    }

    console.log('Database seeded successfully!');
    await db.close();
}

// Run the function and catch any errors
seedDatabase().catch(err => console.error("Seeding failed:", err));
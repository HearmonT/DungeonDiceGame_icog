import { getDb } from './db.js';

export async function getAllHeroes() {
    const db = await getDb();
    const heroes = await db.all('SELECT * FROM heroes');
    await db.close();
    return heroes;
}
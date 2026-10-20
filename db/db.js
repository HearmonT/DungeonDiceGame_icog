import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Helper function to open and return a database connection
export async function getDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}
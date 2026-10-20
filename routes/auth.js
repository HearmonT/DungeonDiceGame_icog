import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/db.js';

const authRouter = express.Router();

// Regex to check if username is 1-20 characters of letters, numbers, _, -, or .
const usernameRegex = /^[a-zA-Z0-9_.-]{1,20}$/;

authRouter.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    // 1. Validate missing fields: If name, username, or password are missing,
    // return a 400 status with { "error": "All fields are required." }
    if (!name || !username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // 2. Validate username format: If !usernameRegex.test(username),
    // return a 400 status with { "error": "Username must be 1-20 characters, using letters, numbers, _, -, or ." }
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: "Username must be 1-20 characters, using letters, numbers, _, -, or ." });
    }

    try {
        const db = await getDb();

        // 3. Hash the password using bcrypt.hash(password, 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. INSERT the new user into the 'users' table using db.run(). 
        // Pass name, username, and the hashedPassword.
        const result = await db.run(
            `INSERT INTO users (name, username, password) VALUES (?, ?, ?)`,
            [name, username, hashedPassword]
        );

        // 5. Bind the user to the session: req.session.userId = result.lastID;
        req.session.userId = result.lastID;

        // 6. Return a 201 status with { "message": "User registered" }
        res.status(201).json({ message: "User registered" });

    } catch (error) {
        // If the error code is 'SQLITE_CONSTRAINT', it means the username already exists
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: "Username already in use." });
        }
        console.error(error);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validation: If missing username or password,
    // return a 400 status with { "error": "All fields are required" }
    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const db = await getDb();

        // 2. Find the user in the database by their username
        const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

        // 3. Verify the user exists AND the password is correct.

        // HINT: Use `await bcrypt.compare(password, user.password)`.
        // If the password is correct, `bcrypt.compare` will return `true`.
        // If the password is incorrect, `bcrypt.compare` will return `false`.
        
    
        // BUT be careful: if `user` is undefined (username not found), accessing `user.password` will crash your app!
        // If the user doesn't exist OR the password doesn't match, 
        // return a 401 status with { "error": "Invalid credentials" }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }   

        // 4. Bind the user to the session: assign the user's id to req.session.userId
        req.session.userId = user.id;
        console.log("LOGIN ROUTE: User logged in! Session is now:", req.session);

        res.status(200).json({ message: "Logged in successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed. Please try again." });
    }
});

//logout route
authRouter.post('/logout', (req, res) => {
    // 1. Destroy the session using req.session.destroy()   
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Logout failed. Please try again." });
        }   
        // 2. Return a 200 status with { "message": "Logged out successfully" }
        res.status(200).json({ message: "Logged out successfully" });
    });
});

export default authRouter;
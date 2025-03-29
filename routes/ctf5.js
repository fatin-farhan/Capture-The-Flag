const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const db = new sqlite3.Database("./database/ctf5db.db");


db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, secretNotes TEXT)");
    db.run("INSERT OR IGNORE INTO users (username, password, secretNotes) VALUES ('admin', 'SuperAdminP@ss123!', 'CTF{You_Are_A_Pro}')");
});

// Vulnerable API Login 
router.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = "${username}" AND ${password}`;
    
    db.get(query, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        req.session.user = user;
        res.status(200).json({ success: true, message: "Login successful" });
    });
});


router.get("/", (req, res) => {
    res.render("ctf5/index", { error: "There is a vulnerable API login at /api/login. Inject a time delay using SQL to confirm exploitation." });
});


router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err || !user) {
            return res.render("ctf5/index", { error: "Invalid username or password" });
        }
        req.session.user = user;
        res.redirect("/ctf5/dashboard");  
    });
});


router.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.render("ctf5/index", { error: null });
    }
    res.render("ctf5/dashboard", { user: req.session.user });
});


router.get("/logout", (req, res) => {
    req.session.destroy(() => {
		res.redirect("/ctf5/");
    });
});

module.exports = router;
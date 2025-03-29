const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const router = express.Router();
const db = new sqlite3.Database("./database/database.db");

db.serialize(() => {
    db.run(
		`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			username TEXT UNIQUE, 
			password TEXT
		)`
	);
    db.run(
		`CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			user TEXT, 
			comment TEXT
		)`
	);

    db.get("SELECT * FROM users WHERE username = 'admin'", async (err, row) => {
        if (!row) {
            const adminPassword = await bcrypt.hash("forever1", 10);
            db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ["admin", adminPassword]);
        }
    });
});

router.get("/", (req, res) => res.render("ctf1/index", { error: null }));


router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = user.username;
            req.session.isAdmin = user.username === "admin";

            if (req.session.isAdmin) {
                res.cookie("FLAG", "RkxBR3tiYWJ5X3N0ZXBfaGFja2VyfQ==", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict",
                });
            }

			
			res.redirect("/ctf1/main");
        }

		if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            res.status(401);
			return res.render("ctf1/index", { error: "Invalid username or password" });
		}    
		
	});
});


router.get("/main", (req, res) => {
    if (!req.session.user) return res.redirect("/ctf1");

    db.all("SELECT * FROM comments", [], (err, comments) => {
        res.render("ctf1/main", { user: req.session.user, isAdmin: req.session.isAdmin, comments });
    });
});

router.get("/register", (req, res) => res.render("ctf1/register", { error: null }));

router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [req.body.username, hashedPassword], (err) => {
            if (err) return res.render("ctf1/register", { error: "Username already exists" });
            res.redirect("/ctf1");
        });
    } catch {
        res.render("ctf1/register", { error: "Something went wrong" });
    }
});

router.post("/comment", (req, res) => {
    if (!req.session.user) return res.redirect("/ctf1");
    db.run("INSERT INTO comments (user, comment) VALUES (?, ?)", [req.session.user, req.body.comment], () => res.redirect("/ctf1/main"));
});

router.post("/delete/:id", (req, res) => {
    if (!req.session.isAdmin) return res.redirect("/ctf1/main");
    db.run("DELETE FROM comments WHERE id = ?", [req.params.id], () => res.redirect("/ctf1/main"));
});

router.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/ctf1")));

module.exports = router;

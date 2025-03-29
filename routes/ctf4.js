const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const { exec } = require("child_process");
const multer = require("multer");
const router = express.Router();
const db = new sqlite3.Database("./database/database.db");
const path = require("path");
const fs = require("fs");

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

router.get("/", (req, res) => res.render("ctf4/index", { error: null }));

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = user.username;
            req.session.isAdmin = user.username === "admin";
			if (req.session.isAdmin) {
                res.cookie("admin", "/ctf4/upload", { httpOnly: true, secure: true, sameSite: "Strict" });
            }
			
			res.redirect("/ctf4/main");
        }

		if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.render("ctf4/index", { error: "Invalid username or password" });
		}    
		
	});
});


router.get("/main", (req, res) => {
    if (!req.session.user) return res.redirect("/ctf4");

    db.all("SELECT * FROM comments", [], (err, comments) => {
        res.render("ctf4/main", { user: req.session.user, isAdmin: req.session.isAdmin, comments });
    });
});


router.get("/register", (req, res) => res.render("ctf4/register", { error: null }));


router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [req.body.username, hashedPassword], (err) => {
            if (err) return res.render("ctf4/register", { error: "Username already exists" });
            res.redirect("/ctf4");
        });
    } catch {
        res.render("ctf4/register", { error: "Something went wrong" });
    }
});


router.post("/comment", (req, res) => {
    if (!req.session.user) return res.redirect("/ctf4");
    db.run("INSERT INTO comments (user, comment) VALUES (?, ?)", [req.session.user, req.body.comment], () => res.redirect("/ctf4/main"));
});


router.post("/delete/:id", (req, res) => {
    if (!req.session.isAdmin) return res.redirect("/ctf4/main");
    db.run("DELETE FROM comments WHERE id = ?", [req.params.id], () => res.redirect("/ctf4/main"));
});


router.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/ctf4")));



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/"); 
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });



router.get("/upload", (req, res) => {
    if (!req.cookies.admin) {
        return res.render("ctf4/upload", { temp: 0 }); 
    }
    res.render("ctf4/upload", { temp: 3 }); 
});


router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.cookies.admin) {
        return res.render("ctf4/upload", { temp: 0 }); 
    }

    const filePath = req.file.path;


    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("File Read Error");

        if (data.includes("/bin/bash")) {
            res.cookie("allow_exec", "true", { httpOnly: true });
            res.cookie("value", "L3RoZS1mb3VydGgtZmxhZw==", { httpOnly: true });
            return res.render("ctf4/upload", { temp: 1 }); 
        } else {
            return res.render("ctf4/upload", { temp: 2 }); 
        }
    });
});


router.get("/the-fourth-flag", (req, res) => {
    let command = req.query.exec;
    if (!command) return res.status(400).send("Missing Execution Parameter");

    
    if (!command.match(/^ls$|^cat\s[\w.-]+$/)) {
        return res.status(400).send("Invalid command");
    }


    exec(command, (err, stdout, stderr) => {
        if (err) return res.status(500).send("Error executing command");
        res.send(`<pre>${stdout}</pre>`);
    });
});

module.exports = router;

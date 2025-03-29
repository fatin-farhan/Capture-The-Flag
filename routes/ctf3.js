const express = require("express");

const router = express.Router();


router.get("/login", (req, res) => {
    res.cookie("auth", "logged in", { httpOnly: true, maxAge: 10000 });
    res.send("You are now logged in!");
});


router.get("/check", (req, res) => {
	const authCookie = req.cookies.auth;
	if (authCookie === "logged in") {
        res.render("ctf3/check", { authCookie: authCookie });
    } else {
        res.render("ctf3/check", { authCookie: null }); 
    }
    });


router.get("/", (req, res) => {
    res.render("ctf3/index");
});

module.exports = router;



const express = require("express");

const router = express.Router();
const FLAG = "CTF{CPTS580}";



// Attacker Page - Only reveals the flag if authenticated
router.get("/", (req, res) => {
    const authCookie = req.cookies.auth;

    if (authCookie === "logged in") {
        res.render("attacker/index", { flag: FLAG });
    } else {
        res.render("attacker/index", { flag: null }); // No flag, show iframe
    }
});

module.exports = router;



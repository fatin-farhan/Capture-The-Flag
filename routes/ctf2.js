const express = require("express");
const router = express.Router();

let visitCount = 0;
let comments = [];
const FLAG_1 = "CTF{XSS_S3RV3R_S1D3_D4T4_L34K}";

router.get("/", (req, res) => {
    visitCount++;

    if (visitCount === 2) {
		visitCount = 0
        comments = [];
    }
    res.render("ctf2/index", { comments });
});


router.post("/comment", (req, res) => {
    comments.push({ name: req.body.name, message: req.body.message });
    res.redirect("/ctf2");
});

router.post("/api/admin/dashboard", (req, res) => {
    const allowedOrigin = "http://localhost:3000";

    if (!req.headers.origin || req.headers.origin !== allowedOrigin) {
        return res.status(403).json({ error: "Forbidden: Invalid origin" });
    }

    res.json({ secretFlag: FLAG_1 });
});

module.exports = router;

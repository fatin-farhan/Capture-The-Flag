const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import Routes
const mainRoutes = require("./routes/main");
const ctf1Routes = require("./routes/ctf1");
const ctf2Routes = require("./routes/ctf2");
const ctf3Routes = require("./routes/ctf3");
const ctf4Routes = require("./routes/ctf4");
const ctf5Routes = require("./routes/ctf5");
const attackRoutes = require("./routes/attacker");

// Use Routes
app.use("/", mainRoutes);
app.use("/ctf1", ctf1Routes);
app.use("/ctf2", ctf2Routes);
app.use("/ctf3", ctf3Routes);
app.use("/ctf4", ctf4Routes);
app.use("/ctf5", ctf5Routes);
app.use("/attacker", attackRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

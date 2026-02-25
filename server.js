const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: "adama-secret-key",
    resave: false,
    saveUninitialized: false
}));

// Temporary in-memory user storage
const users = [];

// Home
app.get("/", (req, res) => {
    res.send(`
        <h1>📚 Adama Library</h1>
        <a href="/register">Register</a><br><br>
        <a href="/login">Login</a>
    `);
});

// Register Page
app.get("/register", (req, res) => {
    res.send(`
        <h2>Register</h2>
        <form method="POST" action="/register">
            <input name="username" placeholder="Username" required/><br><br>
            <input name="password" type="password" placeholder="Password" required/><br><br>
            <button type="submit">Register</button>
        </form>
    `);
});

// Register Logic
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.send("User registered! <br><a href='/login'>Go to Login</a>");
});

// Login Page
app.get("/login", (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form method="POST" action="/login">
            <input name="username" placeholder="Username" required/><br><br>
            <input name="password" type="password" placeholder="Password" required/><br><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Login Logic
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

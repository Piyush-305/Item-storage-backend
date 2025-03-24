const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./storage.db");

app.use(cors());
app.use(express.json());

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    itemType TEXT,
    quantity INTEGER,
    duration INTEGER,
    price INTEGER
)`);

// API to store item details
app.post("/store-item", (req, res) => {
    const { itemType, quantity, duration, totalPrice } = req.body;
    db.run("INSERT INTO items (itemType, quantity, duration, price) VALUES (?, ?, ?, ?)", 
        [itemType, quantity, duration, totalPrice], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Item stored successfully!" });
        }
    );
});

// API to fetch all stored items
app.get("/stored-items", (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));

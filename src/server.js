const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/expenses"
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
      category VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,title,amount,category,created_at FROM expenses ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"Database error"});
  }
});

app.post("/api/expenses", async (req, res) => {
  const {title, amount, category} = req.body;
  const numericAmount = Number(amount);
  if (!title || !category || !Number.isFinite(numericAmount) || numericAmount < 0) {
    return res.status(400).json({error:"Valid title, amount and category are required"});
  }
  try {
    const result = await pool.query(
      `INSERT INTO expenses(title,amount,category) VALUES($1,$2,$3)
       RETURNING id,title,amount,category,created_at`,
      [title.trim(), numericAmount, category.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"Database error"});
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id=$1 RETURNING id", [req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({error:"Expense not found"});
    res.json({message:"Expense deleted"});
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"Database error"});
  }
});

app.get("/health", async (req, res) => {
  try { await pool.query("SELECT 1"); res.json({status:"ok"}); }
  catch { res.status(503).json({status:"database unavailable"}); }
});

initDb().then(() => {
  app.listen(port, () => console.log(`Expense Tracker listening on port ${port}`));
}).catch(e => {
  console.error("Database initialization failed:", e);
  process.exit(1);
});

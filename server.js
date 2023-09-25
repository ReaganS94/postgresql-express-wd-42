const express = require("express");
const app = express();
require("colors");
require("dotenv").config();
const { Pool } = require("pg");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const PORT = 8080;

const pool = new Pool();

app.get("/", (req, res) => {
  res.json("Welcome to my API");
});

app.get("/fighters", (req, res) => {
  pool
    .query("SELECT * FROM fighters;")
    .then((data) => res.send(data.rows))
    .catch((e) => res.sendStatus(500).send("Something went wrong"));
});

// parameterized queries
app.get("/fighters/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM fighters WHERE id=$1;", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500).json(e));
});

app.post("/fighters", (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;

  pool
    .query(
      "INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, country_id, style]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500).send(e));
});

// EDIT
// Edit a fighter in the table

// DELETE
// Delete a fighter in the table

app.get("/time", (req, res) => {
  pool.query("SELECT NOW()", (err, response) => {
    if (err)
      return res
        .status(500)
        .send("Internal Server Error! Something went wrong :(");
    res.send(response.rows[0]);
    // pool.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.rainbow);
});

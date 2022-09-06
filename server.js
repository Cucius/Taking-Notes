const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const fs = require("fs");
const util = require("util");

const PORT = process.env.PORT || 3001;

const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);
const app = express();

//parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// GET Route for homepage
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));
//GET Route for notes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));
//GET api/notes - Read from the file
app.get("/api/notes", (req, res) => {
  readFromFile("db", "utf8").then((data) => res.json(JSON.parse(data)));
});
//POST
app.post("/api/notes", (req, res) => {
  const newNotes = req.body;

  readFromFile("db", "utf8").then((data) => (res.json(JSON.parse(data)).data.push(newNotes).data[data.length - 1].id = data.length - 1));
  writeToFile("db").then((data) => res.json(JSON.stringify(data)));
});
app.listen(PORT, () => console.log(`Listen at http://localhost:${PORT}`));
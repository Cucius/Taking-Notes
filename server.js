const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const fs = require("fs");
const util = require("util");

//Port for Heroku
const PORT = process.env.PORT || 3001;

//fs utility - Node 11 and on does not need util
//could reformat to be const { readFile, writeFile} = require("fs").promises
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);
const app = express();

//parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

//GET Route for notes
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));

//GET api/notes - Read from the file
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

//POST api/notes

app.post("/api/notes", function (req, res) {
  const addedNotes = req.body;
  readFromFile("./db/db.json").then(function (data) {
    //Parse JSON obj into string
    data = JSON.parse(data);
    //Push new data into json
    data.push(addedNotes);
    //Assign id number
    data[data.length - 1].id = data.length - 1;
    //After the note is added write to the file new JSON string
    writeToFile("./db/db.json", JSON.stringify(data));
  });
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));
//DELETE
app.delete("/api/notes/:id", function (req, res) {
  const noteId = req.params.id;
  //Read from the file
  readFromFile("./db/db.json").then(function (data) {
    //Parse JSON obj into string
    data = JSON.parse(data);
    //Splice out based on noteId and only removes 1
    data.splice(noteId, 1);
    //For loop to reset the index
    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
    }
    //After the note is deleted write to the file new JSON string
    writeToFile("./db/db.json", JSON.stringify(data));
  });
});

//App is listening for a connection to the port
app.listen(PORT, () => console.log(`Listen at http://localhost:${PORT}`));

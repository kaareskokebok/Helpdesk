import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
// Laster inn variabler fra .env filen
dotenv.config();

// Environment variables fra .env
// Hvis 2faktor, gå i gmail -> settings -> app password
// const email = process.env.MY_EMAIL;
// const appPass = process.env.APP_PASS;
const email = process.env.MY_EMAIL;
const appPass = process.env.APP_PASS;
const dataFil = "./data/ticketdata.txt";

const app = express();
const port = 3000;
// Henter stilfiler, js-filer, bilder osv. fra public
app.use(express.static("public"));
// Lar oss bruke req.body for å hente skjemadata
app.use(express.urlencoded({ extended: true }));

// ticketnr leses fra fil, før det neste nr gis til kunde
// let ticketnr = 10001;  

function getNextTicketnr(){
    // Leser siste ticketnr fra fil, øker med 1
    // og returnerer dette
    // Hvis filen er tom, returneres 10001.
    fs.readFile(dataFil, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }
    console.log(data);
    });
    return 10003;
}

function skrivTilFil(data){
    // Convert object to a CSV string
const newLine = `\n${data.ticketnr},${data.navn},${data.epost},${data.problemtype},${data.beskrivelse}`;

fs.appendFile(dataFil, newLine, (err) => {
    if (err) {
        console.error("Failed to append data to the file:", err);
    } else {
        console.log("New data added successfully.");
    }
});
}
app.get("/", (req, res) => {
    // Vise fram index.ejs ved localhost:3000/
    res.render("index.ejs");
});
{/* <form action="/submit" method="post"></form> */}

app.post("/submit", (req, res) => {
    console.log(req.body);
    let ticketnr = getNextTicketnr();
    let data = {
        navn: req.body.navn,
        epost: req.body.epost,
        problemtype: req.body.problemtype,
        beskrivelse: req.body.beskrivelse,
        ticketnr: ticketnr  // eller ticketnr
    };
    skrivTilFil(data);
    // Evt. send epost her
    res.render("submit.ejs", data);
});

app.post("/admin", (req, res) => {

});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
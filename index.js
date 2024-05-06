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

const app = express();
const port = 3000;
// Henter stilfiler, js-filer, bilder osv. fra public
app.use(express.static("public"));
// Lar oss bruke req.body for å hente skjemadata
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // Vise fram index.ejs ved localhost:3000/
    res.render("index.ejs");
});
{/* <form action="/submit" method="post"></form> */}

function skrivTilFil(data) {
    let ticketnr = 10002;  // Må leses fra fil (TODO)
    let dataPath = "./data/ticketsdata.txt";
    // Trenger modulen fs
    let nyLinje = `\n${ticketnr},${data.navn},${data.epost},${data.problemtype},${data.beskrivelse}`;

    // Skriv ny linje til fil
    fs.appendFile(dataPath, nyLinje, (err) => {
        if(err) {
            console.error("Failed to append data to file:", err);
        }else{
            console.log("Data added successfully!");
        }
    })
}
app.post("/submit", (req, res) => {
    console.log(req.body);
    // 1. Brukeren vises siden submit.ejs, med en kvittering.
    // 2. Brukerens ticket lagres i ticketsdata.txt
    skrivTilFil(req.body);
    let ticketnr = 10003;
    let data = {
        navn: req.body.navn,
        epost: req.body.epost,
        ticketnr  // Samme som ticketnr:ticketnr
    }
    res.render("submit.ejs", data);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
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
    // let ticketnr = 10002;  // Må leses fra fil (TODO)
    let dataPath = "./data/ticketsdata.txt";
    // Trenger modulen fs
    let nyLinje = `\n${data.ticketnr},${data.navn},${data.epost},${data.problemtype},${data.beskrivelse}`;

    // Skriv ny linje til fil
    fs.appendFile(dataPath, nyLinje, (err) => {
        if(err) {
            console.error("Failed to append data to file:", err);
        }else{
            console.log("Data added successfully!");
        }
    })
}
function getTicketNr() {
    // Lese siste ticketnr fra nederste linje i fila, og returnerer dette. Hvis
    // ingen registrerte tickets, returner 10001
    let dataPath = "./data/ticketsdata.txt";
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if(err) {
            console.error("Feil ved lesning av fil:", err);
            return;  // Avslutt funksjonen getTicketNr
        }
        // Fillesning gikk bra
        // console.log(data);
        // console.log("Med trim()");
        console.log(data.trim());
        let txtFilen = data.trim();
        // Deler opp i et array, der hvert element er en linje i txt-filen
        let linjer = txtFilen.split("\n");
        console.log(linjer);
        let firstLine = linjer[0];
        let firstLetter = linjer[0][0];  // t
        let arrayWords = firstLine.split(",");
        let firstWord = arrayWords[0];
        console.log(firstWord);
        
        // ticketnr på siste rad
        let lastLine = linjer[linjer.length - 1];
        let lastLineWords = lastLine.split(",");
        let lastLineTicketnr = lastLineWords[0];
        console.log(lastLineTicketnr);
        return lastLineTicketnr + 1;
    })
    return 10001;
}
app.post("/submit", (req, res) => {
    console.log(req.body);
    // 1. Brukeren vises siden submit.ejs, med en kvittering.
    // 2. Brukerens ticket lagres i ticketsdata.txt
    
    let ticketnr = getTicketNr();
    let data = {
        navn: req.body.navn,
        epost: req.body.epost,
        beskrivelse: req.body.beskrivelse,
        problemtype: req.body.problemtype,
        ticketnr  // Samme som ticketnr:ticketnr
    }
    skrivTilFil(data);
    res.render("submit.ejs", data);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
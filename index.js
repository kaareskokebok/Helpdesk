import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import { slettLinje, getDataFromFile, adminSubmit } from "./admin.js";  // Import admin functions

// Laster inn variabler fra .env filen
dotenv.config();

// Environment variables fra .env
const email = process.env.MY_EMAIL;
const appPass = process.env.APP_PASS;
const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

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

// localhost:3000/admin
app.get("/admin", (req, res) => {
    // Vise fram index.ejs ved localhost:3000/
    res.render("admin.ejs");  // Ikke logget inn
    // res.render("admin.ejs", {innlogget:true});
});

// Når en ticket er ferdigløst av ansatt/admin
app.post("/ferdig", async (req, res) => {  
    console.log(req.body);
    let ticketnr = req.body.ticketnr;
    console.log("Klar for å fjerne " + ticketnr + " fra txt-filen.");
    let success = await slettLinje(ticketnr);
    let data = await getDataFromFile();
    res.render("admin.ejs", {success, innlogget: true, tickets: data});
});

// Use the imported adminSubmit function for the /adminsubmit route
app.post("/adminsubmit", (req, res) => {
    adminSubmit(req, res, adminUser, adminPass);
});

async function getTicketNr() {
    let dataPath = "./data/ticketsdata.txt";
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const lines = data.trim().split("\n");
        if (lines.length <= 1) {
            return 10001;  // If no tickets are registered, start from 10001
        }
        // Minst 1 ticket.
        const lastLine = lines[lines.length - 1];
        const lastLineWords = lastLine.split(",");
        const lastLineTicketnr = Number(lastLineWords[0]);
        return lastLineTicketnr + 1;  // Return the next ticket number
    } catch (err) {
        console.error("Error reading file:", err);
        return 10001;  // Return default ticket number in case of an error
    }
}

async function skrivTilFil(data) {
    let dataPath = "./data/ticketsdata.txt";
    let nyLinje = `\n${data.ticketnr},${data.navn},${data.epost},${data.problemtype},${data.beskrivelse}`;
    try {
        await fs.appendFile(dataPath, nyLinje);
        console.log("Data added successfully!");
    } catch (err) {
        console.error("Failed to append data to file:", err);
    }
}

app.post("/submit", async (req, res) => {
    console.log(req.body);
    try {
        let ticketnr = await getTicketNr();
        let data = {
            navn: req.body.navn,
            epost: req.body.epost,
            beskrivelse: req.body.beskrivelse,
            problemtype: req.body.problemtype,
            ticketnr
        };
        await skrivTilFil(data);
        res.render("submit.ejs", data);
    } catch (error) {
        console.error("Failed to process form submission:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
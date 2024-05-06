import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
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

app.post("/submit", (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
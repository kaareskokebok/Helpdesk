import fs from "fs/promises";

const dataPath = "./data/ticketsdata.txt";

export async function slettLinje(ticketnr){
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const lines = data.trim().split("\n");
        if (lines.length <= 1) {
            return false;
        }
        let ticketnrStr = String(ticketnr);
        let index = -1;
        for(let i = 0; i < lines.length; i++){
            if(lines[i].includes(ticketnrStr)){
                index = i;
                break;
            }
        }
        if(index >= 0) {
            lines.splice(index, 1);
            // Data tilbake til tekstfil
            let newContent = lines.join("\n");  // Lager en massiv string klar for filen
            await fs.writeFile(dataPath, newContent);
            return true;  // Suksess hvis index er gyldig
        }
        return false;  // Hvis ticketnr ikke funnet
    } catch (err) {
        console.error("Error reading file:", err);
        return false;  // Returner false hvis det er en feil med lesning av fil
    }
}

export async function getDataFromFile(){
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const lines = data.trim().split("\n");
        if (lines.length <= 1) {
            return null;
        }
        lines.splice(0, 1);  // Sletter først linja med overskrifter
        return lines;
    } catch (err) {
        console.error("Error reading file:", err);
        return null;  // Return null if feil med lesning av fil
    }
}

export async function adminSubmit(req, res, adminUser, adminPass) {
    console.log(req.body);
    // Sjekk logg inn
    if(req.body.adminuser === adminUser && req.body.adminpassword === adminPass){
        // Les data fra filen
        let data = await getDataFromFile();
        res.render("admin.ejs", {innlogget: true, tickets: data});
    } else {
        res.render("admin.ejs", {feilmelding: "Feil brukernavn og/eller passord."});
    }
}

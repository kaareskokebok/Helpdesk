# Get started

## Run these commands in root folder
1. `npm i`
2. `npx nodemon index.js` to run the project. If nodemon is not installed, run `npm i -g nodemon` first.

## .env
Fill inn .env with your email and password (or app-pass if you have 2FA).
```
MY_EMAIL=eexample@gmail.com
APP_PASS=qwer ertw qwer frkg
```

## Useful git-commands
- `git init`
- `git rm --cached .env` -> Sletter filen .evn fra GitHub serveren
- `git commit -m "latest.zip added"` -> Klargjør endringer for push med meldingen "latest.zip added"
- `git add .\latest.zip` -> Legg til filen "latest.zip" i neste commit
- `git archive -o latest.zip HEAD` -> Pakker alle filene i prosjektet, UNNTATT filer som og mapper i `.gitignore`, til filen "latest.zip". (Supernyttig).
- `git push` Sender endringene til GitHub server

## Create branch and merge
When your project is working fine, and you want to add a new feature, i.e. Nodemailer functionality or adding style, create a branch. Work on this branch until you are sure everything is working fine, then merge it with main.
- `git branch <branch_name>` -> Creates a new branch.
- `git checkout <branch_name>` -> Switches to the branch.
- `git checkout -b <branch_name>` -> Creates new branch and starts working on this branch (both of the two previous commands in one)
- `git commit -m "<commit message>"` -> Creates a commit for current branch
- `git checkout main` -> Switch back to main branch
- `git merge <branch_name>` -> Merges changes in your new branch with the main branch
- `git push` -> Pushes the changes to GitHub server.
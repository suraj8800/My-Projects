// The purpose of this project is to extract information of worldcup 2019 from cricinfo.
// that in the form of excel and pdf scorecard
// the real purpose is to learn how to extract information and get experience with js
// a very good reason to ever make a project is to have fun

// npm init -y
// npm install minimist
// npm install axios
// npm install jsdom
// npm install excel4node
// npm install pdf-lib

// node CricinfoExtractor.js --excel=worldcup.csv --dataFolder=data --source="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" 

let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let excel4node = require("excel4node");
let pdf = require("pdf-lib");
let path = require("path");
const { match } = require("assert");
let fs = require("fs");


let args = minimist(process.argv);

// download using axios
// extract information using jsdom
// manipulate data using array function
// save in excel using excel4node
// create folder and prepare pdfs

let responsekapromise = axios.get(args.source);
responsekapromise.then(function (response) {
    let html = response.data;

    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    let matches = [];
    let matchdivs = document.querySelectorAll("div.match-score-block");
    for (let i = 0; i < matchdivs.length; i++) {
        let matchdiv = matchdivs[i];
        let match = {
            t1: "",
            t2: "",
            t1s: "",
            t2s: "",
            result: ""
        };

        let teamParas = matchdiv.querySelectorAll("div.name-detail > p.name");
        match.t1 = teamParas[0].textContent;
        match.t2 = teamParas[1].textContent;

        let scoreSpans = matchdiv.querySelectorAll("div.score-detail > span.score");
        if (scoreSpans.length == 2) {
            match.t1s = scoreSpans[0].textContent;
            match.t2s = scoreSpans[1].textContent;
        } else if (scoreSpans.length == 1) {
            match.t1s = scoreSpans[0].textContent;
            match.t2s = "";
        } else {
            match.t1s = "";
            match.t2s = "";
        }

        let resultSpan = matchdiv.querySelector("div.status-text > span");
        match.result = resultSpan.textContent;
        matches.push(match);
    }

    let matchesJSON = JSON.stringify(matches);
    fs.writeFileSync("matches.json", matchesJSON, "utf-8");

    let teams = [];
    for (let i = 0; i < matches.length; i++) {
        PutTeamInTeamsArrayIfmissing(teams, matches[i]);
    }

    for (let i = 0; i < matches.length; i++) {
        putMatchInAppropriateTeam(teams, matches[i]);
    }

    let teamsJSON = JSON.stringify(teams);
    fs.writeFileSync("teams.json", teamsJSON, "utf-8");

    CreateExcelFile(teams);
    CreateFolders(teams);
})

function CreateFolders(teams) {
    fs.mkdirSync(args.dataFolder);
    for (let i = 0; i < teams.length; i++) {
        let teamFN = path.join(args.dataFolder, teams[i].name);
        fs.mkdirSync(teamFN);

        for (let j = 0; j < teams[i].matches.length; j++) {
            let matchFileName = path.join(teamFN, teams[i].matches[j].vs + ".pdf")
            CreateScoreCard(teams[i].name, teams[i].matches[j], matchFileName);
        }
    }

}

function CreateScoreCard(teamName, match, matchFileName){
    let t1 = teamName;
    let t2 = match.vs;
    let t1s = match.selfscore;
    let t2s = match.oppscore;
    let result = match.result;

    let bytesofPDFTemplate = fs.readFileSync("Template.pdf");
    let PDFdockapromise = pdf.PDFDocument.load(bytesofPDFTemplate);
    PDFdockapromise.then(function(pdfdoc){
        let page = pdfdoc.getPage(0);
        page.drawText(t1, {
            x: 320,
            y: 730,
            size: 8
        });
        page.drawText(t2, {
            x: 320,
            y: 716,
            size: 8
        });
        page.drawText(t1s, {
            x: 320,
            y: 702,
            size: 8
        });
        page.drawText(t2s, {
            x: 320,
            y: 688,
            size: 8
        });
        page.drawText(result, {
            x:320,
            y: 674,
            size: 8
        })
        let finalPDFbyteskapromise = pdfdoc.save();
        finalPDFbyteskapromise.then(function(finalpdfbytes){
            fs.writeFileSync(matchFileName, finalpdfbytes);
        })
    })
}

function CreateExcelFile(teams) {
    let wb = new excel4node.Workbook();

    for (let i = 0; i < teams.length; i++) {
        let sheet = wb.addWorksheet(teams[i].name);

        sheet.cell(1, 1).string("VS");
        sheet.cell(1, 2).string("Self Score");
        sheet.cell(1, 3).string("Opp Score");
        sheet.cell(1, 4).string("Result");

        for (let j = 0; j < teams[i].matches.length; j++) {
            sheet.cell(2 + j, 1).string(teams[i].matches[j].vs);
            sheet.cell(2 + j, 2).string(teams[i].matches[j].selfscore);
            sheet.cell(2 + j, 3).string(teams[i].matches[j].oppscore);
            sheet.cell(2 + j, 4).string(teams[i].matches[j].result);
        }
    }

    wb.write(args.excel)
}

function PutTeamInTeamsArrayIfmissing(teams, match) {
    t1idx = -1;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name == match.t1) {
            t1idx = i;
            break;
        }
    }

    if (t1idx == -1) {
        teams.push({
            name: match.t1,
            matches: []
        });
    }

    t2idx = -1;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name == match.t2) {
            t2idx = i;
            break;
        }
    }

    if (t2idx == -1) {
        teams.push({
            name: match.t2,
            matches: []
        });
    }
}

function putMatchInAppropriateTeam(teams, match) {
    t1idx = -1;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name == match.t1) {
            t1idx = i;
            break;
        }
    }

    let team1 = teams[t1idx];
    team1.matches.push({
        vs: match.t2,
        selfscore: match.t1s,
        oppscore: match.t2s,
        result: match.result
    });

    t2idx = -1;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name == match.t2) {
            t2idx = i;
            break;
        }
    }

    let team2 = teams[t2idx];
    team2.matches.push({
        vs: match.t1,
        selfscore: match.t2s,
        oppscore: match.t1s,
        result: match.result
    });
}
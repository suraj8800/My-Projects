// node HackerrankAutomation.js --url=https://www.hackerrank.com/ --config=congif.json
// npm init -y
// npm install minimist
// npm install puppeteer

let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");
const { config } = require("process");

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);

async function run(){
    let browser = await puppeteer.launch({
        headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: null
    });
    
    //get the tab (there only one tab)
    let pages = await browser.pages();
    let page = pages[0];

    // open th url
    await page.goto(args.url);

    // wait and then click on login on page1
    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    // wait and then click on login page2
    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    // type userid
    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", configJSO.userid, {delay: 30});

    // type pasword
    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, {delay: 30});

    // wait and then click on login on page3
    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    // click on compete
    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    // click on manage contest
    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    // click on first contest 
    await page.waitForSelector("p.mmT");
    await page.click("p.mmT");

    await page.waitFor(3000);

    // click on moderator
    await page.waitForSelector("li[data-tab='moderators']");
    await page.click("li[data-tab='moderators']");

    // type moderator
    await page.waitForSelector("input#moderator");
    await page.type("input#moderator", configJSO.moderator, {delay: 10});
    await page.keyboard.press('Enter');
}

run();
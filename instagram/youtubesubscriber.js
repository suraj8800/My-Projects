// node youtubesubscriber.js --url=https://www.instagram.com/  --config=config.json
// npm init -y
// npm install minimist
// npm install puppeteer
// npm install copy-paste


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
    await page.waitFor(2000);

    // type username
    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", configJSO.username, {delay:20});

    // type password
    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, {delay:30});
    
    // click on sign in
    await page.waitForSelector("button[type='submit']");
    await page.click("button[type='submit']");
    await page.waitFor(1000);

    // click on not now
    await page.waitForSelector("svg[aria-label = 'Home']");
    await page.click("svg[aria-label = 'Home']");
    await page.waitFor(2000);

    // click on not now
    await page.waitForSelector("button.HoLwm");
    await page.click("button.HoLwm");
    await page.waitFor(1000);

    // type on searach
    await page.waitForSelector("span.TqC_a");
    await page.click("span.TqC_a");
    await page.type("input[placeholder='Search']", configJSO.instaid,{delay:10});
    await page.waitFor(1000);

    // click on instaid
    await page.waitForSelector("a.-qQT3");
    await page.click("a.-qQT3");
    await page.waitFor(3000);

    // click on follow
    await page.waitForSelector("button._5f5mN.jIbKX._6VtSN.yZn4P");
    await page.click("button._5f5mN.jIbKX._6VtSN.yZn4P");



}

run();
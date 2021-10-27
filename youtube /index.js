// node index.js --url=https://www.youtube.com/  --config=config.json

let puppeteer = require('puppeteer');
let minimist = require('minimist');
let fs = require('fs');

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);

async function run(){
    let browserFetcher = puppeteer.createBrowserFetcher({
        product: 'firefox',
        path: './browser'
        
    });
    
    let revisionInfo = await browserFetcher.download('95.0a1');
    
    let browser = await puppeteer.launch({
        executablePath : revisionInfo.executablePath,
        product: 'firefox',
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
    page = await browser.newPage();
  
    // open th url
    await page.goto(args.url);
    
    // click on sign in
    await page.waitForSelector("tp-yt-paper-button[aria-label='Sign in']");
    await page.click("tp-yt-paper-button[aria-label='Sign in']");

    // type email
    await page.waitForSelector("input[type='email']");
    await page.click("input[type='email']");

    await page.navigationPromise;

    await page.type("input[type='email']", configJSO.email, {delay: 10});

    // click on next
    await page.waitForSelector('#identifierNext');
    await page.click('#identifierNext');
    
    await page.waitFor(500);

    // type password
    await page.waitForSelector('input[type="password"]')
    await page.click('input[type="email"]')
    await page.waitFor(1500);

    await page.type('input[type="password"]', configJSO.Password);
    
    
    // click on next
    await page.waitForSelector('#passwordNext');
    await page.click('#passwordNext');

    await page.navigationPromise;
    await page.waitFor(2000);

    let npage = await browser.newPage();
    await npage.goto('https://www.youtube.com/channel/UCfWH1dZYVfD_wkuV_qVts3g');

    await npage.navigationPromise;

    await npage.waitFor(3000);
    await npage.waitForSelector('#subscribe-button');
    await npage.click('#subscribe-button');

   
    await npage.waitForSelector('#notification-preference-button');
    await npage.click('#notification-preference-button');

    await npage.waitForSelector('style-scope.ytd-menu-popup-renderer.iron-selected');
    await npage.click('style-scope.ytd-menu-popup-renderer.iron-selected');

}
run();
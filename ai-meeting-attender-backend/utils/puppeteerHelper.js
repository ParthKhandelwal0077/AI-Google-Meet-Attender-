const puppeteer = require('puppeteer');



async function testPuppeteerDetection() {
    const browser = await puppeteer.launch({
        headless: false, // Set to true in production
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    // Test User-Agent and WebDriver Detection
    await page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle2' });

    console.log("Test loaded. Check manually if Puppeteer is detected.");
}
async function joinMeeting(meetingURL, meetingName) {
    
    console.log(`Launching Puppeteer for meeting: ${meetingURL}`);

    const browser = await puppeteer.launch({
        headless: false, // Set to true in production
        args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-blink-features=AutomationControlled']
    });


testPuppeteerDetection();
    const page = await browser.newPage();
    try {
        await page.goto(meetingURL, { waitUntil: 'networkidle2' });
        console.log('Meeting page opened successfully.');
        //logs to check if browser detects puppeteer as bot 
        console.log("User Agent:", await page.evaluate(() => navigator.userAgent));
        console.log("Webdriver:", await page.evaluate(() => navigator.webdriver));
        console.log("Plugins:", await page.evaluate(() => navigator.plugins.length));
        console.log("Languages:", await page.evaluate(() => navigator.languages));


        // Handle Google Meet welcome screen (Microphone & Camera)
        try {
            await page.waitForSelector('text=Continue without microphone and camera', { timeout: 5000 });
            await page.click('text=Continue without microphone and camera');
            console.log('Selected: Continue without microphone and camera');
        } catch (err) {
            console.log('No microphone/camera prompt detected, proceeding...');
        }

        // Enter the meeting name
        await page.waitForSelector('input[aria-label="Your name"]', { timeout: 10000 });
        await page.type('input[aria-label="Your name"]', meetingName);
        console.log(`Entered name: ${meetingName}`);

        // Click the 'Ask to join' button
        const askToJoinButton = await page.waitForSelector("button:has(span.UywwFc-RLmnJb)", { timeout: 10000 });

        if (askToJoinButton) {
            await askToJoinButton.click();
            console.log("✅ Clicked on 'Ask to Join' button");
        } else {
            console.log("❌ 'Ask to Join' button not found.");
        }
     
    } catch (error) {
        console.error('Error joining the meeting:', error);
    }

    // Keep the session open for debugging
    setTimeout(async () => {
        console.log('Closing meeting session...');
        await browser.close();
    }, 30 * 60 * 1000); // 30 minutes
}

module.exports = { joinMeeting };

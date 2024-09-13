const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const delay = require("./functions/delay");
const rejectCookies = require("./functions/rejectCookies");
const getAllResults = require("./functions/StageOne/getAllResults");
puppeteer.use(StealthPlugin());
const FileSystem = require("fs").promises;
const execPython = require("./executePythonInJS");
const { executablePath } = require("puppeteer");

//The following URL is acquired from applying appropriate filters on RightMove if necessary then using the link after the results have loaded
const NAVIGATION_URL =
  "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=STATION%5E3176&maxPrice=150000&radius=10.0&propertyTypes=&includeSSTC=false&mustHave=&dontShow=&furnishTypes=&keywords=";
////////////////////////////////////////////
////////////// START OF CRAWLER ///////////
//////////////////////////////////////////
(async function () {
  browser = await puppeteer.launch({
    // executablePath: "/snap/bin/chromium",
    headless: false,
    // args: ["--no-sandbox", "--disable-setuid-sandbox", "--display=:99"],
  });
  console.log("Starting Crawler.");
  page = await browser.newPage();
  try {
    await page.goto(NAVIGATION_URL);
    await delay("rejecting cookies");
    await rejectCookies(page);
    await delay("Collecting ID's of all properties in the search results.");
    const hrefs = await getAllResults(page);
    await browser.close();
    if (hrefs) {
      await FileSystem.writeFile(
        "propertyResultsHrefs.py",
        JSON.stringify(hrefs),
        {
          flags: "w",
        }
      );
      const pythonScriptPath = "test/functions/StageThree/multiThreading.py";
      execPython(pythonScriptPath);
    }
  } catch (error) {
    console.log("Error in start.js: ", error);
  }
})();

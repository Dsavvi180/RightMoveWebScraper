const nearbySales = require("./nearbySales.js");
const delay = require("../delay.js");
const nearbySalesAvailable = require("./nearbySalesAvailable.js");
const rejectCookies = require("../rejectCookies");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const FileSystem = require("fs");
const addObjectToJSONArray = require("../addObjectToJsonArray.js");

// nextUrl = "https://www.rightmove.co.uk/properties/148905416#/?channel=RES_BUY";
async function inspectIndividualProperty(propertyURL) {
  //include page as parameter after testing
  const browser = await puppeteer.launch({
    // executablePath: "$HOME/.cache/puppeteer/chrome",
    headless: false,
    // args: ["--no-sandbox", "--disable-setuid-sandbox",'--display=:99'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(propertyURL);
    await rejectCookies(page);

    // Extracting property details
    const propertyData = {
      URL: propertyURL,
      address: await (async () => {
        try {
          return await page.$eval(
            '[itemprop="streetAddress"]',
            (el) => el.innerText
          );
        } catch (error) {
          return "No Address Found";
        }
      })(),
      propertyType: await (async () => {
        try {
          return await page.$eval(
            "#info-reel > div:nth-child(1)>dd",
            (el) => el.innerText
          );
        } catch (error) {
          return "No Property Type Found";
        }
      })(),
      bedrooms: await (async () => {
        try {
          return await page.$eval(
            "#info-reel > div:nth-child(2)>dd",
            (el) => el.innerText
          );
        } catch (error) {
          return "No Bedrooms Found";
        }
      })(),
      bathrooms: await (async () => {
        try {
          return await page.$eval(
            "#info-reel > div:nth-child(3)>dd",
            (el) => el.innerText
          );
        } catch (error) {
          return "No Bathrooms Found";
        }
      })(),
      size: await (async () => {
        try {
          return await page.$eval(
            "#info-reel > div:nth-child(4)>dd",
            (el) => el.innerText
          );
        } catch (error) {
          return "No Size Found";
        }
      })(),
      price: await (async () => {
        try {
          return await page.evaluate(() => {
            return document.evaluate(
              '//*[@id="root"]/main/div/div[2]/div/article[1]/div[2]/div/div[1]/span[1]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerText;
          });
        } catch (error) {
          return "No Price Found";
        }
      })(),
      phoneNumber: await (async () => {
        try {
          return await page.$$eval("a", (a) => {
            for (let element of a) {
              if (element.innerText == "Call agent") {
                return element.href;
              }
            }
            return "No Phone Number Available";
          });
        } catch (error) {
          return "No Phone Number Found";
        }
      })(),
      keyFeatures: await (async () => {
        try {
          return await page.$eval(
            '[data-testid="primary-layout"] > ul',
            (el) => el.innerText
          );
        } catch (error) {
          return "No Key Features Found";
        }
      })(),
      description: await (async () => {
        try {
          return await page.$eval(
            '[data-testid="primary-layout"] > div:nth-child(5)',
            (el) => el.innerText
          );
        } catch (error) {
          return "No Description Found";
        }
      })(),
      saleHistory: "Sale History Not Available",
      "Nearby Properties Sold": null,
    };

    const saleHistoryButton = await page.evaluate(() => {
      const yearNode = document.evaluate(
        '//*[@id="root"]/main/div/div[2]/div/div[14]/button',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return yearNode ? true : false;
    });

    if (saleHistoryButton) {
      await page.evaluate(() => {
        document
          .evaluate(
            '//*[@id="root"]/main/div/div[2]/div/div[14]/button',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          )
          .singleNodeValue.click();
      });
      await page.waitForTimeout(1000); // Wait for 1 second for sale history to load
      propertyData.saleHistory = await page.evaluate(() => {
        let salesArray = [];
        try {
          const historicSales = document
            .evaluate(
              '//*[@id="root"]/main/div/div[2]/div/div[14]/div/div[2]/div[2]/table/tbody/tr/td[1]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            )
            .singleNodeValue.parentElement.parentElement.querySelectorAll("tr");
          for (let element of historicSales) {
            const year = element.querySelectorAll("td")[0].innerText;
            const price = element.querySelectorAll("td")[1].innerText;
            salesArray.push({ year: year, price: price });
          }
          return salesArray;
        } catch (error) {
          return "No Sales History Found";
        }
      });
    }

    const nearbyHousesAvailable = await nearbySalesAvailable(page);
    if (nearbyHousesAvailable != false) {
      await delay(
        "Navigating to Nearby Sales Page before running nearbySales()"
      );
      propertyData["Nearby Properties Sold"] = await nearbySales(
        page,
        nearbyHousesAvailable
      );
      await delay("Awaiting NearbySales data to arrive");
    }

    await browser.close();

    console.log(JSON.stringify(propertyData));

    return propertyData;
  } catch (error) {
    console.error("Error inspecting individual property:", error);
    await browser.close();
    return {
      Function: "inspectIndividualProperty()",
      Error: error.message,
    };
  }
}

(async function () {
  nextUrl = process.argv[2];
  //   URLS = [
  //     "https://www.rightmove.co.uk/properties/86811990#/?channel=RES_BUY",
  //     "https://www.rightmove.co.uk/properties/145978913#/?channel=RES_BUY",
  //     "https://www.rightmove.co.uk/properties/110893463#/?channel=RES_BUY",
  //     "https://www.rightmove.co.uk/properties/148920611#/?channel=RES_BUY",
  //     "https://www.rightmove.co.uk/properties/146347433#/?channel=RES_BUY",
  //     "https://www.rightmove.co.uk/properties/148682738#/?channel=RES_BUY",
  //     "https://www.rightmove.co.uk/properties/148819535#/?channel=RES_BUY",
  //   ];

  //   const nextUrl = URLS[6];
  const data = await inspectIndividualProperty(nextUrl);
  console.log(data);
  addObjectToJSONArray("individual_property_data.json", data);
})();
module.exports = inspectIndividualProperty;

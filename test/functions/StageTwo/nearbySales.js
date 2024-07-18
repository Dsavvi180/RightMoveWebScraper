const delay = require("../delay");
async function nearbySales(page, href) {
  await page.goto(href);
  await delay("Waiting for Nearby Sales page to load");
  const executeAreaFunction = await page.evaluate(() => {
    (async function () {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    })();
    const propertyObject = [];
    try {
      const recentlySoldProperties = document.querySelectorAll(".propertyCard");
      for (let property of recentlySoldProperties) {
        propertyRecord = {
          address: "",
          priceDate: [],
          bedrooms: "",
          propertyType: "",
        };
        bedsPropType = property
          .querySelector("div>div:nth-child(2)")
          .innerText.split(",");
        propertyRecord.bedrooms = bedsPropType[0];
        propertyRecord.propertyType = bedsPropType[1];
        previousPrices = property.querySelectorAll(".price");
        previousDatesSold = property.querySelectorAll(".date-sold");
        for (let i = 0; i < previousDatesSold.length; i++) {
          let priceAndDate = {
            price: previousPrices[i].innerText,
            date: previousDatesSold[i].innerText,
          };
          propertyRecord.priceDate.push(priceAndDate);
        }
        propertyRecord.address =
          property.querySelector('[data-gtm="title"]').innerText;
        propertyObject.push(propertyRecord);
      }
    
      console.log(propertyObject);
      return propertyObject;
    } catch (error) {
      (error) => {
        console.log(
          "Error running client side data fetching of nearby properties Sold"
        );
        return (propertyObject = "No data");
      };
    }
  });
  return executeAreaFunction;
}

module.exports = nearbySales;

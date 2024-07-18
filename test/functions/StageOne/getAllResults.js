const collectAllProperties = require("./collectAllPropertyIDs");
const collectHrefs = require("./collectHrefs");
const delay = require("../delay");

async function getAllResults(page) {
  try {
    let propertyURLs = [];
    await page.waitForSelector('[data-test="pagination-next"]');

    // Function to get the maximum index and the selected index of the dropdown
    const getDropdownIndices = async () => {
      return await page.evaluate(() => {
        const dropDown = document.querySelector(
          '[data-test="pagination-page-select"]'
        );
        const dropDownMax = dropDown.options.length - 1;
        const dropDownSelectedIndex = dropDown.selectedIndex;
        return { dropDownMax, dropDownSelectedIndex };
      });
    };

    // Initial fetch of dropdown indices
    let { dropDownMax, dropDownSelectedIndex } = await getDropdownIndices();
    let next = await page.$('[data-test="pagination-next"]');

    while (next && dropDownSelectedIndex < dropDownMax) {
      const propertyIDs = await collectAllProperties(page);
      const propertyHrefs = await collectHrefs(page, propertyIDs);
      propertyURLs = propertyURLs.concat(propertyHrefs);

      await next.click();
      await delay("Navigating through results pages for hrefs");

      // Wait for the next page to load
      // await page.waitForNavigation({ waitUntil: "networkidle0" });

      // Update dropdown indices and next button
      ({ dropDownMax, dropDownSelectedIndex } = await getDropdownIndices());
      next = await page.$('[data-test="pagination-next"]');
    }

    console.log(propertyURLs);
    return propertyURLs;
  } catch (error) {
    console.log("Error on getAllResults function: ", error);
  }
}

module.exports = getAllResults;

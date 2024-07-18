async function nearbySalesAvailable(page) {
  const nearByHousesHref = await page.evaluate(() => {
    const outerHTML = `<span>Go to nearby sold prices</span>`;
    let nearByHousesHref = false;
    const elements = document.querySelectorAll("*");
    for (let element of elements) {
      if (element.outerHTML === outerHTML) {
        nearByHousesHref = element.parentElement.href;
        break; // Stop the loop after finding the element
      }
    }
    return nearByHousesHref;
  });

  return nearByHousesHref; // Return the result of nearByHousesHref directly
}

module.exports = nearbySalesAvailable;

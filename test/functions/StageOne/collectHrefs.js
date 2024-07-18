async function collectHrefs(page, propertyIDs) {
  let propertyHrefsList;
  await page
    .evaluate((propertyIDs) => {
      let propertyHrefs = [];
      for (let element of propertyIDs) {
        const node = document
          .getElementById(element)
          .querySelector('[data-test="property-details"]');
        propertyHrefs.push(node ? node.href : null);
      }
      return propertyHrefs;
    }, propertyIDs)
    .then((propertyHrefs) => {
      // console.log("Successfully retrieved property hrefs: ", propertyHrefs);
      propertyHrefsList = propertyHrefs;
    })
    .catch((error) => {
      console.log("error when finding href of properties with error: ", error);
    });
  return propertyHrefsList;
}

module.exports = collectHrefs;

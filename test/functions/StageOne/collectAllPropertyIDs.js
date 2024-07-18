async function collectAllProperties(page) {
  let results;
  await page
    .evaluate((page) => {
      let resultList = [];
      const properties = document.getElementById("l-searchResults");
      const listOfPropertiesResults = properties.querySelectorAll(
        '[class="l-searchResult is-list"]'
      );
      for (let element of Array.from(listOfPropertiesResults)) {
        resultList.push(element.id);
      }
      return resultList;
    })
    .then((resultList) => {
      // console.log("Property ID's successfully retrieved: ", resultList);
      results = resultList;
    })
    .catch((error) => {
      console.log("Error getting the ID's of each property: ", error);
    });
  return results;
}

module.exports = collectAllProperties;

const delay = require("./delay");

async function rejectCookies(page) {
  await delay("executing evaluation of cookies function on client side");
  await page
    .evaluate(() => {
      const rejectCookies = document.getElementById(
        "onetrust-reject-all-handler"
      );
      if (rejectCookies) {
        rejectCookies.click();
      }
    })
    .then(() => {
      console.log("Cookies rejected successfully.");
    })
    .catch((error) => {
      console.log("Error rejecting cookies: ", error);
    });
}

module.exports = rejectCookies;

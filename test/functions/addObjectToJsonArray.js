const FileSystem = require("fs");

function addObjectToJSONArray(filePath, object) {
  FileSystem.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    let JSONArray;
    try {
      JSONArray = JSON.parse(data || "[]"); // Parse existing JSON or initialize as empty array
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      JSONArray = []; // Initialize JSONArray as empty array if parsing fails
    }
    JSONArray.push(object); // Add new object to the array

    FileSystem.writeFile(
      filePath,
      JSON.stringify(JSONArray, null, 2), // Convert JSON array back to string with indentation
      { flags: "a+" }, // Append to file with 'a+' flag
      (err) => {
        if (err) {
          console.error("Error writing to individual_property:", err);
        } else {
          console.log("Successfully wrote to individual_property");
        }
      }
    );
  });
}

module.exports = addObjectToJSONArray;

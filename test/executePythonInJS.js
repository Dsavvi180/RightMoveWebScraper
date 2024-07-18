const { exec } = require("child_process");

function execPython(pythonScriptPath) {
  // Command to run the Python script
  const command = `python3 ${pythonScriptPath}`;

  // Execute the Python script
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the Python script: ${error}`);
      return;
    }
    console.log("Launching Multi-Threading Python Script: \n");
    console.log(`Python script output:\n${stdout}`);
    if (stderr) {
      console.error(`Python script errors:\n${stderr}`);
    }
  });
}

module.exports = execPython;

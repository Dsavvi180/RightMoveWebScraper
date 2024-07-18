function randomNumber() {
  return 1000 + Math.ceil(Math.random() * 1000);
}
function delay(action) {
  time = randomNumber();
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  }).then(console.log("Waited: ", time, "ms before action: ", action));
}

module.exports = delay;

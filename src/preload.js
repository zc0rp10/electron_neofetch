// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

const os = require("os");
const si = require("systeminformation");
const { screen } = require("electron").remote;
const { spawn } = require("child_process");

let pkgCount = [];

//Get the number of installed packages on the system from terminal command line
const getPackages = () => {
  const cliCommand = spawn("pacman", ["-Qq"]);
  cliCommand.stdout.on("data", data => {
    pkgString = `${data}`;
    pkgCount = pkgString.split(/\n/);
  });
};
getPackages();

//Get uptime is seconds from nodeJS then convert to hours and minutes
function secondsToHm() {
  t = os.uptime();
  var h = Math.floor(t / 3600);
  var m = Math.floor((t % 3600) / 60);
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
  return hDisplay + mDisplay;
}

window.addEventListener("DOMContentLoaded", () => {
  $ = document.getElementById.bind(document);
  $("username").innerHTML = os.userInfo(username).username;
  $("hostname").innerHTML = os.hostname();

  $("kernel").innerHTML = os.release();
  $("uptime").innerHTML = secondsToHm();
  $("packages").innerHTML = pkgCount.length;
  $("shell").innerHTML = os.userInfo(username).shell;
  $("resolution").innerHTML = `${screen.getPrimaryDisplay().size.width} x ${
    screen.getPrimaryDisplay().size.height
  }`;
  $("memory").innerHTML = Math.round(os.totalmem() / 1000000) + " " + "MB";

  si.system().then(data => {
    $("host").innerHTML = `${data.model} ${data.version}`;
  });

  si.osInfo().then(data => {
    console.log(data);
    $("os").innerHTML = `${data.distro} ${data.arch}`;
  });
});

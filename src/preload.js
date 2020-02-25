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
const { spawn, exec } = require("child_process");

//Object to hold data from below spawned processes to shell
const dataFromShell = {
  packageCount: Number,
  de: String,
  wm: String
};

//Gets packages count
spawn("pacman", ["-Qq"]).stdout.on("data", data => {
  dataFromShell.packageCount = `${data}`.split(/\n/).length;
});

//Gets Desktop Enviroment
exec('echo "$XDG_CURRENT_DESKTOP"', function(error, stdout) {
  dataFromShell.de = `${stdout}`;
});

//Gets Winow Manager, no simple way to check via bash, only option to brute force over an array with all possibilitites
const wManagers = ["kwin", "xfwm4", "muffin", "mate", "mutter"];
wManagers.forEach(wManager => {
  exec(`pgrep -u 1000 ${wManager}`, function(error, stdout) {
    if (`${stdout}`) {
      dataFromShell.wm = `${wManager}`;
    }
  });
});

//Convert seconds to hours and minutes, left over seconds are ignored
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
  $("packages").innerHTML = dataFromShell.packageCount;
  $("shell").innerHTML = os.userInfo(username).shell;
  $("de").innerHTML = dataFromShell.de;
  $("wm").innerHTML = dataFromShell.wm;
  $("resolution").innerHTML = `${screen.getPrimaryDisplay().size.width} x ${
    screen.getPrimaryDisplay().size.height
  }`;
  $("memory").innerHTML = Math.round(os.totalmem() / 1000000) + " " + "MB";

  si.system().then(data => {
    $("host").innerHTML = `${data.model} ${data.version}`;
  });

  si.osInfo().then(data => {
    $("os").innerHTML = `${data.distro} ${data.arch}`;
    $("os-logo").src = `${data.distro}.svg`;
  });

  si.cpu().then(data => {
    $(
      "cpu"
    ).innerHTML = `${data.manufacturer} ${data.brand} (${data.cores}) @ ${data.speedmax} GHz`;
  });

  si.graphics().then(data => {
    data.controllers.forEach(controller => {
      console.log(`${controller.vendor} ${controller.model}`);
      $("system-info").insertAdjacentHTML(
        "beforeend",
        `<p class="new-line"><span class="green">GPU:</span> <span id="gpu">${controller.vendor} ${controller.model}</span></p>`
      );
    });
  });
});

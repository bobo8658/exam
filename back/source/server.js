const express = require("express");
const { exec } = require("child_process");

var openURL = function (url) {
  // 判断平台
  switch (process.platform) {
    // Mac 使用open
    case "darwin":
      exec(`open ${url}`);
      break;
    // Windows使用start
    case "win32":
      exec(`start ${url}`);
      break;
    // Linux等使用xdg-open
    default:
      exec(`xdg-open ${url}`);
  }
};

const openserver = () => {
  const app = express();

  app.use(express.static("./front")).listen(8080, () => {
    const url = "http://127.0.0.1:8080";
    console.log("server start: ", url);
    openURL(url);
  });
};

module.exports = openserver;

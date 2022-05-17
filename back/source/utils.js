const fs = require("fs");

const hasItem = (path) => fs.existsSync(path);
const getItem = (path) => fs.readFileSync(path, "utf8");
const setItem = (path, item) => fs.writeFileSync(path, item);
const delItem = (path) => fs.unlinkSync(path);

module.exports = { hasItem, getItem, setItem, delItem };

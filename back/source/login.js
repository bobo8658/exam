const encrypt = require("../lib/version");
const myaxios = require("./myaxios");
const { setItem } = require("./utils");

const getSchoolid = (number) => {
  return myaxios({
    method: "post",
    url: `index.php?act=login&op=getschoolData`,
    data: {
      number,
    },
  }).then((res) => {
    const { datas } = res;
    return datas.ID;
  });
};

const login = async (config, path) => {
  const data = {
    username: config.accountnum,
    password: encrypt(config.pwdnum),
    client: "web",
  };
  data.schoolid = await getSchoolid(config.schoolinput);
  return myaxios({
    method: "post",
    url: "index.php?act=login",
    data,
  }).then((res) => {
    const { datas } = res;
    setItem(path || "./key", datas.key);
    return datas.key;
  });
};

module.exports = login;

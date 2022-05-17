#!/usr/bin/env node
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const login = require("./back/source/login");
const { hasItem, getItem } = require("./back/source/utils");
const { getPractiseCourseList } = require("./back/source/getquestionlist");

const init = () => {
  console.log(
    chalk.bold.green(
      figlet.textSync("CCTR  CLI", {
        font: "ANSI Shadow",
      })
    )
  );
};

const inputlist = () => {
  const inputgroup = [
    {
      name: "schoolinput",
      type: "input",
      message: "学校编号",
      default: "U101441",
      filter: (val) => val.toUpperCase(),
    },
    {
      name: "accountnum",
      type: "input",
      message: "学号",
      validate: (val) => {
        if (val.match(/^([1-9][0-9])([1-9][0-9]|[0][1-9]){4}$/)) return true;
        return "学号格式有误";
      },
    },
    {
      name: "pwdnum",
      type: "password",
      message: "密码",
    },
    // {
    //   type: "list",
    //   name: "EXTENSION",
    //   message: "What is the file extension?",
    //   choices: [".rb", ".js", ".php", ".css"],
    //   filter: function (val) {
    //     return val.split(".")[1];
    //   },
    // },
  ];
  return inquirer.prompt(inputgroup);
};

const tologin = async () => {
  const formData = await inputlist();
  // const { schoolinput, accountnum, pwdnum } = formData;
  return login(formData);
};

const run = async () => {
  // show script introduction
  init();

  // ask questions
  // create the file
  // show success message

  const path = process.argv[2] || "./key";
  let key;
  if (hasItem(path) && (key = getItem(path))) {
    const { bootmode } = await inquirer.prompt({
      name: "bootmode",
      type: "list",
      message: "检测到当前已登录，是否使用当前账号。",
      choices: [
        { name: "是", value: true },
        { name: "否", value: false },
      ],
    });
    if (bootmode) {
      return getPractiseCourseList();
    }
  }
  return tologin().then((key) => getPractiseCourseList(key));
};

run();

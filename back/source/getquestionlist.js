const inquirer = require("inquirer");
const myaxios = require("./myaxios");
const { getItem, setItem } = require("./utils");
const openserver = require("./server");

const setinputlist = ({ name, choices, message }) => {
  return inquirer.prompt({
    name,
    type: "list",
    message,
    choices,
  });
};

let token = () => getItem("./key");
let CoursePractiseList;

const getPractiseCourseList = (key = "") => {
  key ||= token();
  myaxios({
    method: "post",
    url: `index.php?act=studentpracticeapi&op=getPractiseCourseList`,
    data: {
      key,
    },
  }).then((res) => {
    const courseList = [];
    const { datas } = res;
    CoursePractiseList = new Map();
    datas.forEach((item) => {
      if (CoursePractiseList.has(item.lessonname)) {
        const last = Array.from([CoursePractiseList.get(item.lessonname)]);
        CoursePractiseList.delete(item.lessonname);
        CoursePractiseList.set(item.lessonname, [...last, item].flat());
      } else {
        courseList.push(item.lessonname);
        CoursePractiseList.set(item.lessonname, [item]);
      }
    });
    changeCourse(courseList);
  });
};
const changeCourse = async (courseList) => {
  const { course } = await setinputlist({
    name: "course",
    choices: courseList,
    message: "请选择课程",
  });
  const practiselist = [];
  CoursePractiseList.get(course)?.forEach((item) => {
    practiselist.push({ name: item.practicename, value: item });
  });
  changePractise(practiselist);
};
const changePractise = async (practiselist) => {
  const { practise } = await setinputlist({
    name: "practise",
    choices: practiselist,
    message: "请选择练习",
  });
  getStudentPractiseQuestionList(practise);
};
const getStudentPractiseQuestionList = (fullData) => {
  const key = token();
  const { courseid, practiseid, id: studentpractiseid, teacherid } = fullData;
  let { questioncount } = fullData;
  let allquestionlist = [];
  let practisetype = 0
  const recursion = async (pageindex = 1, split = []) => {
    let overcount = questioncount > 500 ? ((questioncount -= 500), true) : null;
    const data = {
      key,
      courseid,
      practiseid,
      studentpractiseid,
      teacherid,
      // pagecount: 15, // datas.questioncount,
      pagecount: overcount ? 500 : questioncount,
      pageindex,
      practisetype,
      statenum: 0,
      id: split[pageindex - 1] || "",
      studentpractisequestioncount: questioncount,
    };
    const { questionlist, split: splitArrayDate = split } = await myaxios({
      method: "post",
      url: `index.php?act=studentpracticeapi&op=getStudentPractiseQuestionList`,
      data,
    }).then((response) => {
      const { questionlist, split } = response.datas;
      return { questionlist, split };
    });
    allquestionlist = [...allquestionlist, ...questionlist];
    if (pageindex < splitArrayDate.length) {
      return recursion(pageindex + 1, splitArrayDate);
    } else if (practisetype === 0){
      practisetype = 1
      return recursion(1, splitArrayDate);
    }
    setItem("./front/list.json", JSON.stringify(allquestionlist));
    openserver();
  };
  return recursion();
};

module.exports = { getPractiseCourseList };

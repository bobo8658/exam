const axios = require("axios");
const FormData = require("form-data");

const baseUrl = "https://api.cctrcloud.net/mobile/";

const myaxios = (config) => {
  const { method = "get", url, data } = config;
  let formData = new FormData();
  Object.keys(data).forEach((item) => formData.append(item, data[item]));

  return axios({
    method,
    url: baseUrl + url,
    data: formData,
    headers: {
      ...formData.getHeaders(),
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

module.exports = myaxios;

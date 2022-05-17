const JSEncrypt = require("node-jsencrypt");

var exam_public_key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDLyh5Lb/5TprGvS9yFCcpCYnb
0FuSyY3+TPbJI7Pv3+u4eFoqGGN46qyFOVLhUuFRttMfoA8h8yrdYCssLi93baoB
yTMYf5/KVlviLKXWd3TDOJdeSX4d+qLUp/WK0ckm2VaJuY5vW0x5x6WbZ8MSxwTD
MqNNMgVUdOgD3MIScwIDAQAB
-----END PUBLIC KEY-----`;

//使用公钥加密
const encrypt = (params) => {
  var encrypt = new JSEncrypt();
  // encrypt.setPrivateKey(exam_private_key);
  encrypt.setPublicKey(exam_public_key);
  var encrypted = encrypt.encrypt(params);
  return encrypted;
};

module.exports = encrypt;

var express = require("express");
const cors = require("cors");
var app = express();
var net = require("net");
var fs = require("fs");
var xmlParser = require("xml2json");
const { toXML } = require("jstoxml");
var client = new net.Socket();

var xmlFile = null; //xml파일 문자열 형
var jsonXmlFile = null; // xml파일 객체 형
var ipArray = [];
var dgram = require("dgram"); //udp
var socket = dgram.createSocket("udp4"); //udp소켓 생성

var tempRes = null; // 응답받는곳 임시저장소
var tempReq = null; //무엇을 하였는가
var nowSocketPlay = false;
var nowPlayType = null;

app.use(express.json());
app.use(cors());
fs.readFile(__dirname + "/xml/character.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  xmlFile = xmlParser.toJson(data); //문자열 화
  jsonXmlFile = JSON.parse(xmlFile); //객체화
  console.log(
    jsonXmlFile.scriptList.script //script출력
  );

  // fs.writeFile(
  //   __dirname + "/xml/character.xml",
  //   toXML(jsonXmlFile, { header: true }),
  //   function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("updated!");
  //     }
  //   }
  // );
});

app.listen(3001, () => {
  console.log("start server");
});

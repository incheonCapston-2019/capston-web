var express = require("express");
const cors = require("cors");
var app = express();
var net = require("net");
var fs = require("fs");
var xmlParser = require("xml2json");
const { toXML } = require("jstoxml");
var client = null;
var xmlFile = null; //xml파일 문자열 형
var jsonXmlFile = null; // xml파일 객체 형
var ipArray = null;
app.use(express.json());
app.use(cors());
fs.readFile(__dirname + "/xml/ip.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  xmlFile = xmlParser.toJson(data); //문자열 화
  jsonXmlFile = JSON.parse(xmlFile); //객체화
  ipArray = jsonXmlFile.ipList.ip; //아이피 배열 저장
});
//로컬

app.post("/speakerConnect", function (req, res, next) {
  console.log("req : ", req.body);
  if (ipArray.indexOf(req.body.url) == -1) {
    //중복 ip가 아닌경우 ip추가
    ipArray.push(req.body.url);
    jsonXmlFile.ipList.ip = ipArray;
    next();
  } else {
    //중복된 ip인 경우 캔슬
    res.send("중복");
  }
});
app.use((req, res, next) => {
  //중복 ip가 아닌경우 스피커 아이피 확인을 하기 위한 소켓통신
  client = new net.Socket();

  //121.143.22.128
  client.connect(5000, "127.0.0.1", function () {
    console.log("연결완료");
  });
  client.on("connect", function () {
    console.log("connect");
    client.write("1 " + req.body.url);
  });

  client.on("data", function (data) {
    console.log("Received:" + data);
    if (data == "true") {
      //ip연결 됨 - 저장
      fs.writeFile(
        __dirname + "/xml/ip.xml",
        toXML(jsonXmlFile, { header: true }),
        function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log("updated!");
            res.send("저장");
          }
        }
      );
    } else {
      //연결이 안되는 경우
      res.send("실패");
    }
    client.end();
  });

  client.on("timeout", function () {
    console.log("소켓 타임아웃");
  });

  client.on("error", function (err) {
    console.log(err);
  });

  client.on("end", function () {
    console.log("Connection end");
  });
  client.on("close", function () {
    console.log("Connection closed");
  });
});
app.listen(3001, () => {
  console.log("start server");
});

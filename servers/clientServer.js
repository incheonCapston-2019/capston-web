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

var characterXml = null;
app.use(express.json());
app.use(cors());
fs.readFile(__dirname + "/xml/ip.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  xmlFile = xmlParser.toJson(data); //문자열 화
  jsonXmlFile = JSON.parse(xmlFile); //객체화
  ipArray = jsonXmlFile.ipList.ip; //아이피 배열 저장
});
fs.readFile(__dirname + "/xml/character.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  characterXml = JSON.parse(xmlParser.toJson(data)); //문자열 및 객체화
});
//121.143.22.128
client.connect(5000, "127.0.0.1", function () {
  console.log("연결완료");
});

client.on("connect", function () {
  console.log("connect");
});

//로컬
app.get("/speakerIp", function (req, res, next) {
  console.log("실행", ipArray);
  if (ipArray.length >= 3) res.send(ipArray);
  else res.send("blank");
});

app.get("/scriptListCall", function (req, res, next) {
  let resData = { ...characterXml, ipArray };
  res.send(resData);
});
app.post("/scriptListSave", function (req, res, next) {
  var tmpParam2 = req.body.arr.speakerIndex;
  console.log(req.body.index, tmpParam2);
  for (let index = 0; index < tmpParam2.length; index++) {
    tmpParam2[index] = tmpParam2[index].split("스피커")[1];
  }

  characterXml.scriptList.script[req.body.index].userChoice.title = "1";
  characterXml.scriptList.script[req.body.index].userChoice.index = tmpParam2;
  console.log(characterXml);
  fs.writeFile(
    __dirname + "/xml/character.xml",
    toXML(characterXml, { header: true }),
    function (err, data) {
      if (err) {
        console.log(err);
        res.send("실패");
      } else {
        console.log("updated!");
        res.send(true);
      }
    }
  );
});

app.delete("/speakerIpDelete", function (req, res, next) {
  console.log(req.body.url);
  console.log(ipArray);
  var toDeleteArray = ipArray.indexOf(req.body.url);
  if (toDeleteArray != -1) {
    //저장된 아이피라면
    ipArray.splice(toDeleteArray, 1);
    jsonXmlFile.ipList.ip = ipArray;
    fs.writeFile(
      __dirname + "/xml/ip.xml",
      toXML(jsonXmlFile, { header: true }),
      function (err, data) {
        if (err) {
          tempRes.send("실패");
        } else {
          console.log("updated!");
        }
      }
    );
  }
  res.send("삭제 완료");
});

app.post("/speakerConnect", function (req, res, next) {
  console.log("req : ", req.body);
  console.log(ipArray);
  if (!nowSocketPlay) {
    nowSocketPlay = true;
    if (ipArray.indexOf(req.body.url) == -1) {
      //중복 ip가 아닌경우
      client.write("1 " + req.body.url);
      tempRes = res;
      tempReq = req;
      nowPlayType = "speaker";
    } else {
      //중복된 ip인 경우 캔슬
      nowSocketPlay = false;
      res.send("중복");
    }
  } else res.send("Loading");
});

client.on("data", function (data) {
  console.log("Received:" + data);
  if (nowPlayType == "speaker") {
    if (data == "true") {
      //ip연결 됨 - 저장
      console.log("스피커 아이피 저장");
      ipArray.push(tempReq.body.url);
      jsonXmlFile.ipList.ip = ipArray;
      fs.writeFile(
        __dirname + "/xml/ip.xml",
        toXML(jsonXmlFile, { header: true }),
        function (err, data) {
          if (err) {
            console.log(err);
            tempRes.send("실패");
          } else {
            console.log("updated!");

            tempRes.send("저장");
          }
        }
      );
    } else {
      //연결이 안되는 경우
      tempRes.send("실패");
    }
  } else {
    console.log("외부실행");
  }

  nowSocketPlay = false;
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
app.listen(3001, () => {
  console.log("start server");
});

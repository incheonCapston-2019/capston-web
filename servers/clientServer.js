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
var xmlHeader = true;
var tempRes = null; // 응답받는곳 임시저장소
var tempReq = null; //무엇을 하였는가
var nowSocketPlay = false;
var nowPlayType = null;
var nowPlaying = false;

var rollXml = null;
var playerListXml = null;
app.use(express.json());
app.use(cors());
fs.readFile(__dirname + "/xml/ip.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기

  xmlFile = xmlParser.toJson(data); //문자열 화
  jsonXmlFile = JSON.parse(xmlFile); //객체화
  ipArray = jsonXmlFile.ipList.ip; //아이피 배열 저장
});
fs.readFile(__dirname + "/xml/roll.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  rollXml = JSON.parse(xmlParser.toJson(data)); //문자열 및 객체화
  console.log(rollXml);
});
fs.readFile(__dirname + "/xml/playerList.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  playerListXml = JSON.parse(xmlParser.toJson(data)); //문자열 및 객체화
  console.log(playerListXml.scriptList);
});
function OBJtoXML(obj) {
  if (xmlHeader) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlHeader = !xmlHeader;
  } else {
    var xml = "";
  }
  for (var prop in obj) {
    xml += obj[prop] instanceof Array ? "" : "<" + prop + ">";
    if (obj[prop] instanceof Array) {
      for (var array in obj[prop]) {
        xml += "<" + prop + ">";
        xml += OBJtoXML(new Object(obj[prop][array]));
        xml += "</" + prop + ">";
      }
    } else if (typeof obj[prop] == "object") {
      xml += OBJtoXML(new Object(obj[prop]));
    } else {
      xml += obj[prop];
    }
    xml += obj[prop] instanceof Array ? "" : "</" + prop + ">";
  }
  var xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
  return xml;
}

//121.143.22.128
client.connect(10000, "127.0.0.1", function () {
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
  //대본목록 불러오기
  let resData = { ...rollXml, ipArray };
  res.send(resData);
});
app.get("/scriptSaveCall", function (req, res, next) {
  //대본저장소 불러오기
  let resData = { ...rollXml, ipArray };
  res.send(resData);
});
app.get("/scriptPlayerCall", function (req, res, next) {
  //재생목록 불러오기
  res.send(playerListXml);
});

app.post("/scriptListSave", function (req, res, next) {
  //대본목록 저장
  var tmpParam2 = req.body.arr.speakerIndex;
  console.log(req.body.index, tmpParam2);
  for (let index = 0; index < tmpParam2.length; index++) {
    tmpParam2[index] = tmpParam2[index].split("스피커")[1];
  }
  console.log(rollXml);
  rollXml.scriptList.script[req.body.index].userChoice.title = "1";
  rollXml.scriptList.script[req.body.index].userChoice.index = tmpParam2;

  fs.writeFile(__dirname + "/xml/roll.xml", OBJtoXML(rollXml), function (
    err,
    data
  ) {
    if (err) {
      console.log(err);
      xmlHeader = !xmlHeader;
      res.send("실패");
    } else {
      console.log("updated!");
      xmlHeader = !xmlHeader;
      res.send(true);
    }
  });
});

app.post("/playerListSave", function (req, res, next) {
  //재생목록 저장
  console.log(req.body.data, playerListXml); //배열
  var tempObject = {
    title: req.body.data,
  };
  //if(playerListXml.scriptList.script.title.)
  playerListXml.scriptList.script = tempObject;
  fs.writeFile(
    __dirname + "/xml/playerList.xml",
    OBJtoXML(playerListXml),
    function (err, data) {
      if (err) {
        console.log(err);
        xmlHeader = !xmlHeader;
        res.send("실패");
      } else {
        console.log("updated!");
        xmlHeader = !xmlHeader;
        res.send(true);
      }
      xmlHeader = !xmlHeader;
    }
  );
});
app.post("/playListPlay", function (req, res, next) {
  //재생
  client.write("2_" + req.body.data);
  res.send("true");
  nowPlaying = true;
  tempRes = res;
  tempReq = req;
});
app.get("/playListStop", function (req, res, next) {
  //정지
  client.write("5");
  tempRes = res;
  tempReq = req;
  nowPlayType = "stop";
});
app.get("/playListPause", function (req, res, next) {
  //일시 정지
  client.write("3");
  tempRes = res;
  tempReq = req;
  nowPlayType = "pause";
});
app.get("/playListRePlay", function (req, res, next) {
  //재실행
  client.write("4");
  tempRes = res;
  tempReq = req;
  nowPlayType = "replay";
});
app.delete("/scriptListDelete", function (req, res, next) {
  //대본목록 삭제
  console.log(req.body.checkedBox);
  for (let index = 0; index < req.body.checkedBox.length; index++) {
    if (req.body.checkedBox[index]) {
      rollXml.scriptList.script[index].userChoice.title = "0";
    }
  }
  fs.writeFile(__dirname + "/xml/roll.xml", OBJtoXML(rollXml), function (
    err,
    data
  ) {
    if (err) {
      console.log(err);
      xmlHeader = !xmlHeader;
      res.send("실패");
    } else {
      console.log("updated!");
      xmlHeader = !xmlHeader;
      res.send(true);
    }
  });
});
app.delete("/speakerIpDelete", function (req, res, next) {
  //스피커 IP 삭제
  var toDeleteArray = ipArray.indexOf(req.body.url);
  if (toDeleteArray != -1) {
    //스피커가 저장된 아이피라면
    ipArray.splice(toDeleteArray, 1);
    jsonXmlFile.ipList.ip = ipArray;
    fs.writeFile(
      __dirname + "/xml/ip.xml",
      toXML(jsonXmlFile, { header: true, indent: " " }),
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
      //중복 ip가 아닌 경우
      client.write("1_" + req.body.url);
      tempRes = res;
      tempReq = req;
      nowPlayType = "speaker";
    } else {
      //중복된 ip인 경우 캔슬(무시)
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
        toXML(jsonXmlFile, { header: true, indent: " " }),
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
  } else if (nowPlayType == "play") {
    tempRes.send("실행 중 서버 응답");
  } else if (nowPlayType == "stop") {
    tempRes.send("정지 완료");
  } else if (nowPlayType == "pause") {
    tempRes.send("일시 정지 완료");
  } else if (nowPlayType == "replay") {
    tempRes.send("재실행 완료");
  } else if (nowPlaying) {
    tempRes.send("대본 끝");
  } else {
    console.log("외부 실행");
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

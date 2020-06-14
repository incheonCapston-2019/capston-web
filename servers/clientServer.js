var express = require("express");
const cors = require("cors");
var app = express();
var net = require("net");
var fs = require("fs");
var xmlParser = require("xml2json");
var xml2js = require("xml2js");
var builder = new xml2js.Builder();
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

var roleXml = null;
var playerListXml = null;
app.use(express.json());
app.use(cors());
fs.readFile(__dirname + "/xml/ip.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기

  xmlFile = xmlParser.toJson(data); //문자열 화
  jsonXmlFile = JSON.parse(xmlFile); //객체화
  ipArray = jsonXmlFile.ipList.ip; //아이피 배열 저장
});
fs.readFile(__dirname + "/xml/role.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  roleXml = JSON.parse(xmlParser.toJson(data)); //문자열 및 객체화
  console.log(roleXml);
});
fs.readFile(__dirname + "/xml/playerList.xml", "utf8", function (err, data) {
  //서버 개설 시 파일 읽기
  playerListXml = JSON.parse(xmlParser.toJson(data)); //문자열 및 객체화
  console.log(playerListXml.scriptList.script);
});

//121.143.22.128
client.connect(10000, "127.0.0.1", function (res, req, next) {
  console.log("연결완료");
});

client.on("connect", function () {
  console.log("connect");
});
//req.socket.setKeepAlive();

app.get("/speakerIp", function (req, res, next) {
  console.log("실행", ipArray);
  if (ipArray.length >= 3) res.send(ipArray);
  else res.send("blank");
});

app.get("/scriptListCall", function (req, res, next) {
  //대본목록 불러오기
  let resData = { ...roleXml, ipArray };
  res.send(resData);
});
app.get("/scriptSaveCall", function (req, res, next) {
  //대본저장소 불러오기
  let resData = { ...roleXml, ipArray };
  res.send(resData);
});
app.get("/scriptPlayerCall", function (req, res, next) {
  //재생목록 불러오기
  res.send(playerListXml);
});
app.get("/speakerKill", function (req, res, next) {
  client.write("100");
  res.send("요청완료");
});
app.post("/scriptListSave", function (req, res, next) {
  //대본목록 저장
  var tmpParam2 = req.body.arr.speakerIndex;
  console.log(req.body.index, tmpParam2);
  for (let index = 0; index < tmpParam2.length; index++) {
    tmpParam2[index] = tmpParam2[index].split("스피커")[1] - 1;
  }
  console.log(roleXml);
  roleXml.scriptList.script[req.body.index].userChoice.title = "1";
  roleXml.scriptList.script[req.body.index].userChoice.index = tmpParam2;

  fs.writeFile(
    __dirname + "/xml/role.xml",
    builder.buildObject(roleXml),
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
    }
  );
});

app.post("/playerListSave", function (req, res, next) {
  //재생목록 저장
  console.log(req.body.data, playerListXml); //배열
  if (Array.isArray(req.body.data)) {
    //넘어온게 배열이면
    for (let index = 0; index < req.body.data.length; index++) {
      if (
        playerListXml.scriptList.script.title.indexOf(req.body.data[index]) ==
        -1
      ) {
        //플레이리스트에 없는 경우
        playerListXml.scriptList.script.title.push(req.body.data[index]);
      }
    }
    fs.writeFile(
      __dirname + "/xml/playerList.xml",
      builder.buildObject(playerListXml),
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
  } else {
    if (playerListXml.scriptList.script.title.indexOf(req.body.data) == -1) {
      //넘어온게 배열이 아니면 플레이리스트에 없는 경우
      playerListXml.scriptList.script.title.push(req.body.data);
      fs.writeFile(
        __dirname + "/xml/playerList.xml",
        builder.buildObject(playerListXml),
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
    } else {
      res.send("중복");
    }
  }
});
app.put("/playListRevise", function (req, res, next) {
  //재생 목록 수정
  console.log(req.body.data);
  playerListXml.scriptList.script.title = req.body.data;
  fs.writeFile(
    __dirname + "/xml/playerList.xml",
    builder.buildObject(playerListXml),
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
app.post("/playListPlay", function (req, res, next) {
  //재생
  nowPlayType = "play";
  client.write("2_" + req.body.data);
  nowPlaying = true;
  tempRes = res;
  tempReq = req;
});
app.get("/playListStop", function (req, res, next) {
  //정지
  client.write("5");
  res.send("true");
});
app.get("/playListPause", function (req, res, next) {
  //일시 정지
  client.write("3");
  res.send("true");
});
app.get("/playListRePlay", function (req, res, next) {
  //재실행
  client.write("4");
  res.send("true");
});
app.get("/playListprevJump", function (req, res, next) {
  //이전 건너뛰기
  client.write("6");
  res.send("true");
});
app.get("/playListnextJump", function (req, res, next) {
  //이후 건너뛰기
  client.write("7");
  res.send("true");
});

app.delete("/playerListDelete", function (req, res, next) {
  //재생목록 삭제
  console.log(req.body.data, playerListXml); //배열
  for (let index = 0; index < req.body.data.length; index++) {
    if (req.body.data[index]) {
      playerListXml.scriptList.script.title.splice(
        playerListXml.scriptList.script.title.indexOf(req.body.data[index]),
        1
      );
    }
  }
  fs.writeFile(
    __dirname + "/xml/playerList.xml",
    builder.buildObject(playerListXml),
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
    }
  );
});

app.delete("/scriptListDelete", function (req, res, next) {
  //대본목록 삭제
  console.log(req.body.checkedBox);
  for (let index = 0; index < req.body.checkedBox.length; index++) {
    if (req.body.checkedBox[index]) {
      roleXml.scriptList.script[index].userChoice.title = "0";
    }
  }
  fs.writeFile(
    __dirname + "/xml/role.xml",
    builder.buildObject(roleXml),
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
    }
  );
});
app.delete("/scriptListsetDelete", function (req, res, next) {
  //대본목록 설정 삭제
  console.log(req.body.checkedBox);
  for (let index = 0; index < req.body.checkedBox.length; index++) {
    if (req.body.checkedBox[index]) {
      roleXml.scriptList.script[index].userChoice.title = "0";
    }
  }
  fs.writefile(
    __dirname + "/xml/role.xml",
    builder.buildObject(roleXml),
    function (err, data) {
      if (err) {
        console.log(err);
        xmlHeader = !xmlHeader;
        res.send("실패");
      } else {
        console.log("setting deleted");
        xmlHeader = !xmlHeader;
        res.send(true);
      }
    }
  );
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
      builder.buildObject(jsonXmlFile),
      function (err, data) {
        if (err) {
          res.send("실패");
        } else {
          res.send("삭제 완료");
        }
      }
    );
  }
});

app.post("/speakerConnect", function (req, res, next) {
  //스피커 ip저장
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
        builder.buildObject(jsonXmlFile),
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
  } else if (nowPlaying) {
    tempRes.send("재생 끝");
    nowPlaying = !nowPlaying;
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

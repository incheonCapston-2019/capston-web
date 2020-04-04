var express = require("express");
const cors = require("cors");
var app = express();

var net = require("net");

var client = null;

app.use(express.json());
app.use(cors());

//로컬

app.post("/speakerConnect", function (req, res, next) {
  client = new net.Socket();
  console.log("스피커 커넥트 연결");
  console.log("req : ", req.body);

  client.connect(10000, "121.143.22.128", function () {
    console.log("연결완료");
  });
  client.on("connect", function () {
    console.log("connect");
    client.write("1 " + req.body.url);
  });

  client.on("data", function (data) {
    console.log("Received:" + data);
    if (data == "true") {
      res.send("true");
    } else {
      res.send("false");
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

app.post("/speakerConnect1", function (req, res, next) {
  client = new net.Socket();
  console.log("스피커 커넥트 연결");
  console.log("req : ", req.body);

  client.connect(10001, "121.143.22.128", function () {
    console.log("연결완료");
  });
  client.on("connect", function () {
    console.log("connect");
    client.write("1 " + req.body.url);
  });

  client.on("data", function (data) {
    console.log("Received:" + data);
    if (data == "true") {
      res.send("true");
    } else {
      res.send("false");
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

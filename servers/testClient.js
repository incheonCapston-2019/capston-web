var express = require("express");
const cors = require("cors");
var app = express();
var axios = require("axios");
var net = require("net");
var tempRes = null;
var client = null;

app.use(express.json());
app.use(cors());

client = new net.Socket({ transports: ["websocket"] });
client.connect(5000, "127.0.0.1", function () {
  console.log("연결완료");
});
//로컬

app.post("/speakerConnect", function (req, res, next) {
  console.log("req", req.body);
  client.write("1 " + req.body.url);
  tempRes = res;
});
client.on("data", function (data) {
  console.log("Received:" + data);
  tempRes.send(data);
});
client.on("timeout", function () {
  console.log("소켓 타임아웃");
});

client.on("error", function (err) {
  console.log(err);
});

client.on("close", function () {
  console.log("Connection closed");
});
client.on("end", function () {
  console.log("end");
});

app.listen(3001, () => {
  console.log("start server");
});

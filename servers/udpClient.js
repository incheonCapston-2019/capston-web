var dgram = require("dgram");
var socket = dgram.createSocket("udp4");

var msg = Buffer.from(`message`).toString("utf8");

socket.send(msg, 0, msg.length, 10000, "121.143.22.128", function (err) {
  console.log(msg);
  if (err) {
    console.log("UDP message send error", err);
    return;
  }
  console.log("메세지 전송 성공");
  socket.close();
});

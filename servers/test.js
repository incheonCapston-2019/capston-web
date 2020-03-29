var express = require("express");
const cors = require("cors");
var app = express();

var net = require("net");

var client = null;

app.use(express.json());
app.use(cors());

app.post("/speakerConnect", function(req, res, next) {
  console.log("req", req.body);

  client = new net.Socket();
  client.connect(10000, "121.143.22.128", function() {
    console.log("연결완료");
    client.write("1 " + req.body.url);
  });

  client.on("data", function(data) {
    console.log("Received: " + data);
    client.destroy(); // kill client after server's response
  });

  client.on("close", function() {
    console.log("Connection closed");
  });
  client.on("error", function(err) {
    console.log(err);
  });
  res.send("server response");
});

app.listen(3001, () => {
  console.log("start server");
});

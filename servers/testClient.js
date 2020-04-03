const cors = require("cors");
var app = require("express")();
var server = require("http").createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require("socket.io")(server);

// app.use(express.json());
// app.use(cors());

//로컬
var test = 1;
app.post("/speakerConnect", function(req, res, next) {
  client.on("connect", function() {
    console.log("connect");
  });
  console.log("req", req.body);
  client.write("1 " + req.body.url);

  client.on("data", function(data) {
    console.log(test++);
    console.log("Received:" + data);

    client.end();
  });
  client.on("timeout", function() {
    console.log("소켓 타임아웃");
  });

  client.on("error", function(err) {
    console.log(err);
  });

  client.on("end", function() {
    console.log("Connection end");
  });

  client.on("close", function() {
    console.log("Connection closed");
  });
});

// app.post("/speakerConnect1", function(req, res, next) {
//   console.log("req", req.body);

//   client.write("2 이건 버튼 테스트");

//   client.on("data", function(data) {
//     console.log("Received: " + data);
//     if (data == "") {
//       console.log("유저에게 보냄");
//     } else {
//       console.log("코오딩");
//     }
//   });
// });

server.listen(3001, function() {
  console.log("Server On !");
});

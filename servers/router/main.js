module.exports = function(app) {
  app.post("/speakerConnect", function(req, res, next) {
    console.log("req", req.body);
    next();
  });

  app.use(function(req, res, next) {
    res.send(201, "server response");
  });
};

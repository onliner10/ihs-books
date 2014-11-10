var http = require('http');

var app = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

module.exports = app;
app.listen(process.env.HTTP_PORT);

console.log("Server running at http://127.0.0.1:"+process.env.HTTP_PORT+"/");

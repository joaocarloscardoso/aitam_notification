var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

var service = require('./lib/service.js');

/*
app.get('/', function(req, res) {
    res.sendfile('index.html');
});
*/

http.listen(3010, function() {
    console.log('server listening on port: 3010');
    io.on("connection", socket => {
        console.log("New client connected: " + socket.id);

        socket.on("requestCUBE", function(message){
            service.CreateRequest(message.sessionid, message.objectid, message.subject);
            console.log(message);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
});




var express = require('express');
var WebSocket = require('ws');
var open = require('open');
var app = express();
var server = require('http').createServer(app);
app.use(express.static(__dirname + '/examples/'));
server.listen(3000);

var browserSocket,unitySocket;
var wss = new WebSocket.Server({ port: 3001 });
var browserSocket,unitySocket;
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		message = JSON.parse(message);
		switch(message.path){
			case "browser":
				browserSocket = ws;
				if(unitySocket&&unitySocket.readyState === WebSocket.OPEN)unitySocket.send(JSON.stringify({path:'unityData',data:'start'}));
				console.log('browserSocket')
				break;
			case "unity":
				unitySocket = ws;
				console.log('unitySocket')
				if(browserSocket&&browserSocket.readyState === WebSocket.OPEN)browserSocket.send(JSON.stringify({path:'unityData',data:'start'}));
				break;
			case "browserData":
				if(unitySocket&&unitySocket.readyState === WebSocket.OPEN)unitySocket.send(JSON.stringify(message));
				break;
			case "unityData":
				if(browserSocket&&browserSocket.readyState === WebSocket.OPEN)browserSocket.send(JSON.stringify(message));
				break;
		}
	});
});
open('http://localhost:3000/js/solar-system.html');
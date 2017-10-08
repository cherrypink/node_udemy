var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var config = require('./config/config');
mongoose.connect(config.url);
var db = mongoose.connection;

var func = require('./func/functions');
var Attend = require('./models/attend');
var Message = require('./models/message');

var roomList = {};
var userInfoList = [];
	//usernames = [];

server.listen(process.env.PORT || 30000);
console.log('Server running on port');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	console.log('Socket Connected');

	socket.on('new user', function(data, callback){
		socket.join(data.room);
		console.log('Joining the room...'+data.room + ' user is...'+data.username);

		Attend.insertInOutLog(func.returnAttendInfo(data, 'IN'));
		func.addUserInfoList(data,userInfoList, socket);
		func.addRoomList(data,roomList, io,socket);
		Message.loadMessage(data.room, data.currentStart, data.index, callback);
	});

	// Send Message
	socket.on('send message', function(data){
		var username = '';
		for(var idx in userInfoList){
			if(userInfoList[idx].id == socket.id){
				username = userInfoList[idx].username;
				break;
			}
		};
		var message = {
			username : username,
			room     : data.room,
			msg      : data.msg
		}
		Message.insertMsgLog(message);
		io.sockets.in(data.room).emit('new message', {msg : data.msg, user:username});
	});

	//Disconnect
	socket.on('disconnect', function(data){
		if(userInfoList.length == 0){
			return;
		}
		var exitUser = '';
		for(var idx in userInfoList){
			if(userInfoList[idx].id == socket.id){
				exitUser = userInfoList[idx];
				break;
			}
		}
		var room = exitUser.room;
		var id   = exitUser.id;
		userInfoList.splice(idx,1);

		Attend.insertInOutLog(func.returnAttendInfo(exitUser, 'OUT'));
		func.updateRoomList(room, id,roomList, io);
	});
});

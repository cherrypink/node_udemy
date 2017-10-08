var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
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
		callback(true);
		socket.join(data.room);
		console.log('Joining the room...'+data.room + ' user is...'+data.username);
		addUserInfoList(data);
		addRoomList(data);
	});

	function addUserInfoList(data){
			var userInfo = {'id':socket.id , 'room' : data.room, 'username' : data.username};
			userInfoList.push(userInfo);
	}

	function addRoomList(data){
			roomList[data.room] = roomList[data.room] || [];
			roomList[data.room].push({'id':socket.id, 'username' : data.username});
			updateUsernames(data.room, roomList[data.room]);
	}

	function updateRoomList(room, id){
		for (var i =0; i<roomList[room].length;i++){
			if(roomList[room][i].id == id){
				roomList[room].splice(i,1);
				break;
			}
		}
	}
	//update usernames
	function updateUsernames(room, userList){
		io.sockets.in(room).emit('usernames', userList);
	}

	// Send Message
	socket.on('send message', function(data){
		var username = '';
		for(var idx in userInfoList){
			if(userInfoList[idx].id == socket.id){
				username = userInfoList[idx].username;
				break;
			}
		}
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
		updateRoomList(room, id);
		//usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames(room, roomList[room]);
	});
});

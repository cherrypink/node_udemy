var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

module.exports ={
  returnAttendInfo: function(data, inout){
    var info = {
      'username' : data.username,
      'room' : data.room,
      'inout' : inout
    };
    return info;
  },

  addUserInfoList : function(data, userInfoList, socket){
      var userInfo = {'id':socket.id , 'room' : data.room, 'username' : data.username};
      userInfoList.push(userInfo);
  },

  addRoomList : function(data,roomList, io, socket){
      roomList[data.room] = roomList[data.room] || [];
      roomList[data.room].push({'id':socket.id, 'username' : data.username});
      this.updateUsernames(data.room, roomList[data.room], io);
  },

  updateRoomList : function(room, id,roomList, io){
    for (var i =0; i<roomList[room].length;i++){
      if(roomList[room][i].id == id){
        roomList[room].splice(i,1);
        break;
      }
    }
    this.updateUsernames(room, roomList[room], io);
  },

  updateUsernames: function(room, userList, io){
    io.sockets.in(room).emit('usernames', userList);
  }

}

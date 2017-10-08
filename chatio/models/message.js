var mongoose = require('mongoose');
var date     = require('date-utils');
var newDate = new Date();

var MessageSchema = new mongoose.Schema({
  username : String,
  room     : String,
  message  : String,
  sendTime : String
});

var Message = module.exports = mongoose.model("Message", MessageSchema);

// Insert log
module.exports.insertMsgLog = function(message){
  var newLogInfo = new Message({
    username : message.username,
    room     : message.room,
    message    : message.msg,
    sendTime: newDate.toFormat('YYYY-MM-DD HH24:MI:SS')
  });
  newLogInfo.save(function(err, newLogInfo){
    if(err) return console.error(err);
    console.log(newLogInfo + "saved");
  });
}

// Load Message
module.exports.loadMessage = function(room, start, limit, callback){
  Message.find({'room' : room}).skip(start).limit(limit).sort({sendTime:'desc'}).exec(function(err, msg){
    if(err) console.error(err);
    callback(msg);
  });
}

var mongoose = require('mongoose');
var date     = require('date-utils');
var newDate = new Date();

var AttendSchema = new mongoose.Schema({
  username : String,
  room     : String,
  inout     : String, // IN / OUT
  eventTime : String
});

var Attend = module.exports = mongoose.model("Attend", AttendSchema);

// Insert log
module.exports.insertInOutLog = function(info){
  var newLogInfo = new Attend({
    username : info.username,
    room     : info.room,
    inout    : info.inout,
    eventTime: newDate.toFormat('YYYY-MM-DD HH24:MI:SS')
  });
  newLogInfo.save(function(err, newLogInfo){
    if(err) return console.error(err);
    console.log(newLogInfo + "saved");
  });
}

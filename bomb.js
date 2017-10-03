const sendTextMessage = require("./send.js");
const db = require("./db.js");

db.query("SELECT `msg_id` FROM `users` WHERE msg_id IS NOT NULL", function(err, results){
    db.end();
    results.forEach((user)=>{
        Promise.resolve().then(()=>{sendTextMessage(user.msg_id, "小八小藍機器爆炸拉!")});
    });
});
const sendTextMessage = require("./src/utils/send.js").sendTextMessage;
const db = require("./src/utils/db.js");

db.query("SELECT `msg_id` FROM `admin` WHERE msg_id IS NOT NULL", function(err, results){
    db.end();
    results.forEach((user)=>{
        Promise.resolve()
            .then(()=>{
                sendTextMessage(user.msg_id, "小八小藍機器爆炸拉!")}
            ).catch((err)=>{
                console.log(err)
            });
    });
});
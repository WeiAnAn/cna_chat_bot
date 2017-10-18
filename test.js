const sendTextMessage = require("./src/utils/send.js").sendTextMessage;
const db = require("./src/utils/db");

let message = "[爆炸] 一堆機器 下線啦!! 詳見S_monitor";

db.execute("SELECT `msg_id` FROM `Admin` WHERE msg_id IS NOT NULL AND `graduated` = 0 AND gid <= 8 AND enable = 1", function(err, results){
    db.end();
    results.forEach((users)=>{
        sendTextMessage(users.msg_id, message);
    });
});
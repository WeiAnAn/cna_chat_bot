const sendTextMessage = require("./src/utils/send.js").sendTextMessage;
const db = require("./src/utils/db");
const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: process.env.DB2_HOST,
    user: process.env.DB2_USER,
    password: process.env.DB2_PASS,
    database: process.env.DB2_DATABASE
});

let sql = `SELECT description, hostname, status_event_count 
	FROM host
	WHERE status_event_count = 3;`

connection.query(sql, function(err, rows){
	connection.destroy();
	if(err)
		return console.log(err);

	if(rows.length > 0 ){
        if(err)
            throw err;

        if(rows.length > 3){
            let message = "[爆炸] 一堆機器 下線啦!! 詳見S_monitor";
            
            db.execute("SELECT `msg_id` FROM `Admin` WHERE msg_id IS NOT NULL AND `graduated` = 0 AND gid <= 8 AND enable = 1", function(err, results){
                results.forEach((users)=>{
                    sendTextMessage(users.msg_id, message);
                });
            });
        }else{
            db.execute("SELECT `msg_id` FROM `Admin` WHERE msg_id IS NOT NULL AND `graduated` = 0 AND gid <= 8 AND enable = 1", function(err, results){
                rows.forEach((machine)=>{
                    let message = `${machine.description} ( ${machine.hostname} ) 下線啦!!`;
                    results.forEach((users)=>{
                        sendTextMessage(users.msg_id, message);
                    });
                });
            });
        }		
	}
});
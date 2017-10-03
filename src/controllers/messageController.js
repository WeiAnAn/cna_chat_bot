const db = require("../utils/db.js");
const sendTextMessage = require("../utils/send.js").sendTextMessage;
const sendLoginButton = require("../utils/send.js").sendLoginButton;
const sendLogoutButton = require("../utils/send.js").sendLogoutButton;


function verifyWebhook(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);          
    }  
}

function webhook(req, res){
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                }else if (event.account_linking) {
                    receivedAccountLinking(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
}

function receivedAccountLinking(event){
    let senderID = event.sender.id;
    let status = event.account_linking.status;
    
    if(status == "linked"){
        let user = JSON.parse(
            new Buffer(event.account_linking.authorization_code, "base64").toString("utf-8")
        );
        if(user.admin){
            updateMsgId(user.username, senderID, function(err, results){
                if(results.affectedRows == 1)
                    sendTextMessage(senderID, "開啟通知成功");
            })
        }
    }else{
        removeMsgId(senderID, function(err, results){
            if(results.affectedRows == 1)
                sendTextMessage(senderID, "關閉通知成功");
        })
    }
}


function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:", 
        senderID, recipientID, timeOfMessage);
    // console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        var msgArr = messageText.split(" ");
        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (msgArr[0]) {
            case '網管關閉通知':
                sendLogoutButton(senderID);
                break;
            case '網管開啟通知':
                sendLoginButton(senderID);
                break;
            default:
                // sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        // sendTextMessage(senderID, "Message with attachment received");
    }
}

function updateMsgId(username, id, cb){
    db.execute(
        "UPDATE `users` SET msg_id=? WHERE `username`=?",
        [id, username],
        cb
    );
}

function removeMsgId(msg_id, cb){
    let sql = db.execute(
        "UPDATE `users` SET msg_id=NULL WHERE `msg_id`=?",
        [msg_id],
        cb
    );
}

module.exports = {
    webhook: webhook,
    verifyWebhook: verifyWebhook
}
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db.js");
const sendTextMessage = require("./send.js");

app.use(bodyParser.json());

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);          
    }  
});


app.post('/webhook', function (req, res) {
    var data = req.body;
    console.log("post webhook");
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
});



function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:", 
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;


    if (messageText) {

        var msgArr = messageText.split(" ");
        console.log(senderID);
        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (msgArr[0]) {
            case '網管開啟通知':
                if(validateSecret(msgArr[2])){
                    updateMsgId(msgArr[1], senderID, function(err, results){
                        if(results.affectedRows == 1)
                            sendTextMessage(senderID, "validate success");
                    });
                }
                break;
            default:
                // sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function validateSecret(secret){
    return secret === process.env.SECRET;
}

function updateMsgId(username, id, cb){
    db.execute(
        "UPDATE `users` SET msg_id=? WHERE `username`=?",
        [id, username],
        cb
    );
}

app.listen(3000);
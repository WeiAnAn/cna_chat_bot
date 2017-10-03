const request = require("request");
require("dotenv").config();

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    callSendAPI(messageData);
}

function sendLoginButton(recipientId){
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type: "template",
                payload:{
                    template_type: "button",
                    text: "請登入網管系統",
                    buttons:[
                        {
                            "type": "account_link",
                            "url": process.env.HOST + "/authorize"
                        }
                    ]
                }
            }
        }
    }
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.ACCESS_TOKEN },
      method: 'POST',
      json: messageData
  
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;
  
        console.log("Successfully sent generic message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
        console.error("Unable to send message.");
        console.error(response);
        console.error(error);
      }
    });  
}

module.exports.sendTextMessage = sendTextMessage;
module.exports.sendLoginButton = sendLoginButton;
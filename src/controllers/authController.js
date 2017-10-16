const db = require("../utils/db.js");
const md5 = require("md5");
require("dotenv").config();

function authorizeView(req, res){
    return res.render("login", req.query);    
}

function authorize(req, res){
    let { username, password, redirect_uri } = req.body;
    db.execute(
        "SELECT password FROM `users` WHERE username=?",
        [username],
        function(err, results){
            if(err)
                throw err;
            else{
                if(results.length == 1){
                    user = results[0];
                    if(user.password == password){
                        let authCodeObj = {
                            admin: true,
                            username: username
                        };
                        let authCode = new Buffer(JSON.stringify(authCodeObj)).toString("base64");
                        return res.redirect(redirect_uri+"&authorization_code="+authCode);
                    }
                }
                return res.redirect("back");
            }
        }
    );
}

function hashPassword(text){
    return md5(md5(text)+process.env.HASH_SALT);
}

module.exports = {
    authorizeView: authorizeView,
    authorize: authorize
}
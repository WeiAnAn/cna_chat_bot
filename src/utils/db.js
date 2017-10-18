const mysql2 = require("mysql2");
const path = require("path");
const result = require("dotenv").config({path: path.resolve(__dirname, "../../.env")});

let pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

module.exports = pool;
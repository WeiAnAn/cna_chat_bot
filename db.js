const mysql2 = require("mysql2");
require("dotenv").config();

let pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

// pool.execute("SELECT * FROM")

module.exports = pool;
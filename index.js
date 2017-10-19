const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./src/routers/router.js");
const helmet = require("helmet");

app.set('views', './views');
app.set('view engine', 'pug');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(router);    

app.listen(3000);
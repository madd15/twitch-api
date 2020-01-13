const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POSTS, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use(express.static('/app/src'));

app.get('/', function(req,res) {

  res.sendFile(path.join('/app/src/index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.route('/_twitch/followers').get((req, res, next) => {
  console.log(req.query['hub.callback']);
}).post(bodyParser, (req, res) => {
  res.send('Ok');
  console.log(req.body);
});

module.exports = app;

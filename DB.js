const mysql = require("mysql");

const host = "localhost";

let connection = mysql.createConnection({
    host     : '127.0.0.1', //실제로 연결할 데이터베이스의 위치
    user     : 'root',
    password : "tech7975",
    database : 'needrobot' //데이터베이스 이름
  });

  connection.connect();

  module.exports = connection;
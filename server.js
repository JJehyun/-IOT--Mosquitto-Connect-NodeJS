const express = require('express');
const mysql = require('mysql');
const db = require("./DB.js");
const app = express();
const mailer = require('./mail');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://127.0.0.1:1883');

   app.listen(8080,function(){
    console.log('listening on 8080');
    setInterval(
      ()=>{
        client.publish('MY_TOPIC','hello mqtt');
    },2000
  )

  client.subscribe('MY_TOPIC');
  client.on('message',function(topic,message){
    console.log(`토픽:${topic.toString()}, 메세지:${message.toString()}`)
  })
  });


//아이디 회원가입 함수
app.get('/join', (req, res) => {
  db.query('INSERT INTO users(id,pwd,nickname,phone) VALUES (? , ? , ? , ?) ' ,[req.query.email , req.query.pwd ,req.query.nickname ,req.query.phone], (error,results,fields) =>{
    res.status(200).send("회원가입이 완료되었습니다.");  
  })
  });


//로그인 함수
app.get('/login', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ? AND pwd = ?' ,
  [req.query.id , req.query.password], (error,results,fields) =>{
    if(results[0]){
      //회원 조회 O
      res.status(200).send(true);
    }else{
      //회원 조회 X
      res.status(200).send(false);
    }
    })
  });


  //아이디 찾기 함수
  app.get('/findid', (req, res) => {
    const sql = "SELECT * FROM users WHERE phone=? AND nickname =?"
    db.query(sql ,[req.query.phone ,req.query.name], (error,results,fields) =>{
      if(results[0]){
        res.status(200).send(results[0].id);
      }else{
        res.status(200).send("일치 하는 아이디 없습니다.");
      }
      })
    });


  //비밀번호 변경 함수
  app.get('/changepw', (req, res) => {
    const sql = "UPDATE users SET pwd = ? WHERE id = ?"
    db.query(sql ,[req.query.password ,req.query.EMail], (error,results,fields) =>{
        res.status(200).send("변경이 완료 되었습니다.");
      })
    });

    //비밀번호 찾기 함수
    app.get('/findpwmail', (req, res) => {
      const sql = "SELECT * FROM users WHERE nickname=? AND id = ?"
      db.query(sql ,[req.query.name ,req.query.EMail], (error,results,fields) =>{
        if(results[0]){
          //아이디, 이름으로 회원 정보 조회O
          var variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
          var randomPassword = createRandomPassword(variable, 8);
           //비밀번호 랜덤 함수
          function createRandomPassword(variable, passwordLength) {
          var randomString = "";
            for (var j=0; j<passwordLength; j++) 
              randomString += variable[Math.floor(Math.random()*variable.length)];
               return randomString
             }
        let emailParam = {
        toEmail: req.query.id,     // 수신할 이메일
    
        subject: '회원 가입 인증 메일입니다.',   // 메일 제목
    
        text: `안녕하세요 인증번호는 : ` + randomPassword + `입니다`               // 메일 내용
      };
      //  mailer.sendGmail(emailParam);
          console.log(randomPassword)
          res.status(200).send(randomPassword);
        }else{
          //아이디, 이름으로 회원 정보 조회O
          res.status(200).send(false);
        }
        })
      });


//회원 가입 인증 관련 함수
app.get('/mail' , (req,res) =>{
  db.query('SELECT * FROM users WHERE id = ?' ,[req.query.id], (error,results,fields) =>{
    if(results[0]){
      res.status(200).send(true);
      console.log("아이디 있음")
    }else{
      console.log("아이디 없음")
      var variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
      var randomPassword = createRandomPassword(variable, 8);
       //비밀번호 랜덤 함수
      function createRandomPassword(variable, passwordLength) {
      var randomString = "";
        for (var j=0; j<passwordLength; j++) 
          randomString += variable[Math.floor(Math.random()*variable.length)];
           return randomString
         }
    let emailParam = {
    toEmail: req.query.id,     // 수신할 이메일

    subject: '회원 가입 인증 메일입니다.',   // 메일 제목

    text: `안녕하세요 인증번호는 : ` + randomPassword + `입니다`               // 메일 내용
  };
//  mailer.sendGmail(emailParam);
  console.log(randomPassword)
  res.status(200).send(randomPassword);
    }
  })
})



var express = require('express');
var mysql=require('mysql');
var path=require('path');
var app=express();
var con=mysql.createConnection({
  hostname : "localhost",
  user :"madhu",
  password : "madhu",
  database : "mydb"
});
con.connect(function(error) {
  if(error) throw error;
  console.log("connection successful");
})
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname+'/p.html'));
});

//home function
app.get("/home", function(req, res) {
    con.query("select * from classes",function(error,rows,fields) {
      if(error) throw error;
      res.send(rows);
    });
    //res.send("welcome madhu");
});

// class add function
app.get('/add',function(req,res) {
  var temp1=req.query.cname;
  console.log(temp1);
  con.query("insert into classes(cname) values('"+temp1+"')",function(error) {
    if(error) throw error;
    console.log("record added");
    res.send("record added");
  });
});

//class update funtion
app.get('/update',function(req,res) {
  console.log("update function");
  var temp1=req.query.cid;
  console.log(temp1);
  var temp2=req.query.cname;
  console.log(temp2);
  con.query("update students set class='"+temp2+"' where class in (select cname from classes where cid="+temp1+")",function(error,result) {
    if(error) throw error;
    console.log("student class names changed");
  });
  con.query("update classes set cname='"+temp2+"' where cid="+temp1,function(error,result) {
    if(error) throw error;
    console.log("record updated");
  });
  console.log(temp1);
  res.send("welcome");
});

//class delete function
app.get('/delete',function(req,res) {
  var temp1=req.query.cid;
  con.query('delete from students where class in (select cname from classes where cid='+temp1+')',function(error,result) {
    if(error) throw error;
  });
  con.query('delete from classes where cid='+temp1,function(error,result) {
    if(error)  throw error;
    console.log("record deleted");
  })
  res.send("row deleted");
});

//student home function
app.get('/shome',function(req,res) {
  var temp1=req.query.cid;
  console.log(temp1);
  var temp2="";
  con.query("select cname from classes where cid="+temp1,function(error,rows,fields) {
    if(error) throw error;
    temp2=rows[0]['cname'];
    console.log(temp2);
    con.query("select * from students where class='"+temp2+"'",function(error1,rows1,fields1) {
      if(error) throw error;
      res.send(rows1);
    });
  });
});
//student add function
app.get('/sadd',function(req,res) {
  var temp1=req.query.sname;
  var temp2=req.query.age;
  var temp3=req.query.cid;
  con.query("select cname from classes where cid="+temp3,function(error,result) {
    if(error) throw error;
    var temp4=result[0]['cname'];
    console.log("insert into students(sname,age,class) values('"+temp1+"',"+temp2+",'"+temp4+"')");
    con.query("insert into students(sname,age,class) values('"+temp1+"',"+temp2+",'"+temp4+"')",function(error1,result1) {
        if(error1) throw error1;
        console.log("student record added");
        res.send("student record added");
    });
  });

});
//student update function
app.get('/supdate',function(req,res) {
  var temp1=req.query.sid;
  var temp2=req.query.sname;
  var temp3=req.query.age;
  console.log("update students set sname='"+temp2+"',age="+temp3+" where sid="+temp1);
  con.query("update students set sname='"+temp2+"',age="+temp3+" where sid="+temp1,function(error,result) {
    if(error) throw error;
    console.log("student row updated");
    res.send("row updated");
  });
});
app.get('/deletestud',function(req,res) {
  var temp1=req.query.sid;
  console.log(temp1);
  con.query("delete from students where sid="+temp1,function(error,rows,fields) {
    if(error) throw error;
    console.log("row deleted");
    res.send("student row deleted");
  });
});
app.listen(1000,function() {
  console.log("port 1000");
});

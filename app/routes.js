// app/routes.js

var database = require('/home/neerajbabbar/sample_app/config/database.js');
var nodemailer = require('nodemailer');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'paytm@197',
  database : 'sample'
});

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "neerajbabbar90@gmail.com",
        pass: ""
    }
});
var rand,mailOptions,host,link;

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    
    app.get('/profile', function(req, res) {

        console.log("cookie:" +req.cookies.username);
        if(req.cookies.username){
        res.render('profile.ejs' ); 
        }else{
            res.end("You need to login to access this page");
        }
    });
    
    
    app.get('/login', function(req, res) {

        res.render('login.ejs'); 
    });
    
    
     app.get('/forgot', function(req, res) {

        res.render('forgot.ejs'); 
    });
    
    app.post('/forgot',function(req,res){
        
        connection.query("select * from users where username = '"+req.body.email+"'",function(err,rows,fields){
            if(!err){
                if(rows.length>0){
                    var random=Math.floor((Math.random() * 100) + 54);
                    console.log("random:" + random);
                    var sql ='update users set pwdreset = "'+random +'" where username = "'+req.body.email+'"';
                       console.log("sql:" +sql);
                         connection.query(sql,
                                function (err, res) {
                                    if (!err) {
                                        console.log("success " + random);

                                    }
                                    else {
                                        console.log("error" + err);
                                    }
                                });
                    host = req.get('host');
                    var lnk = "http://" + req.get('host') + "/newp?id=" + random + "&username=" + req.body.email;
                    mailOptions = {
                        to: req.body.email,
                        subject: "Forgot password",
                        html: "Hello,<br> Please Click on the link to set up new password.<br><a href=" + lnk + ">Click here to reset pwd</a>"
                    }
                    console.log(mailOptions);

                    smtpTransport.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);
                            res.end("error");
                        } else {
                            console.log("Message sent: " + response.message);
                            res.end("password reset email sent. please check your inbox");
                        }
                    });
                    
                }else{
                    res.end("user does not exist");
                }
            }else{
                console.log(err);
            }
        });
        
    });
    
    //set new password
    app.get('/newp',function(req,res){
       //req.query.username
       
       //res.send(req.query.username)
       connection.query("select * from users where username = '"+req.query.username+"'",function(err,rows,field){
         if(!err){
            if(rows.length>0) {
              if(rows[0].PWDRESET == req.query.id){
                 res.render('newp.ejs'); 
              }else{
                  res.end('invalid req');
              }
          }else{
              res.end("invalid request");
          }
         }else{
             console.log(err);
         }
       })
      
    });
    
    app.post('/newp',function(req,res){
        
    connection.query('SELECT * from users where username = "'+req.body.email+'"', function(err, rows, fields) {
    if (!err)
      { 
        console.log('The solution is: ', rows);
        if(rows.length>0){
                connection.query('update users set password = "'+req.body.password+'" where username = "'+req.body.email+'"',function(error,response){
                   if(!error){
                      res.end("password reset successfully done");
                      // res.redirect('/login');
                   }else{
                       console.log(error);
                   } 
                });
                
                
             } else{
                 console.log("User does not exist");
                 res.end("user does not exist. invalid request");
             }
            
       }
        else
            {
                console.log('Error while performing Query.');
            
            }
        });
        
    });
    

    // process the login form
    app.post('/login', function(req,res){
        
     connection.query('SELECT * from users where username = "'+req.body.email+'" and password = "'+req.body.password+'"', function(err, rows, fields) {
    if (!err)
      { 
        console.log('The solution is: ', rows);
        if(rows.length>0){
                if(rows[0].ISVERIFIED=="1")           
                {
                    console.log("can login");
                    /*connection.query("update users set islogged = '1' where username = '"+req.body.email+"'" , function(err,res){
                      if(err){
                          console.log(err);
                      }  else{
                          console.log("logged in");
                      }
                    });*/
                    res.cookie('username', req.body.email , { maxAge: 36000000, httpOnly: true });
                    
              
                    res.redirect('/profile');
                }
                else{
                    console.log("user has not been verified");
                    res.end("user has not been verified");
                }
             } else{
                 console.log("Incorrect username or password");
                 res.end("Incorrect username or password");
             }
            
       }
        else
            {
                console.log('Error while performing Query.');
            
            }
        });
        
    });

    // SIGNUP 
    // show the signup form
    app.get('/signup', function(req, res) {
        
        res.render('signup.ejs');
    });

    app.post('/signup',function(req,res){
        
        console.log("success " + req.body.email);
        
        
       //var issuccess = database(req,res);
            database(req,res,function(err,success){
            //if(issuccess == 1){
                console.log("error:" + err);
                
            if(err){
                console.log(err);
                res.end("User already exists");
            }else{
                
               // connection.connect();
              
             rand=Math.floor((Math.random() * 100) + 54); 
                
            connection.query('Insert into users(username,password,rand) values ("'+req.body.email +'","'+req.body.password+'","'+rand+'")',
            function(err,res){
            if(!err){
                console.log("suc" + res);
                
            }
            else{
                console.log("error" + err);
            }
            });
            
         //   connection.end();
                
            
            host=req.get('host');
            link="http://"+req.get('host')+"/verify?id="+rand+"&username="+req.body.email;
            mailOptions={
                to : req.body.email,
                subject : "Please confirm your Email account",
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
            }
            console.log(mailOptions);
            
             smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                        console.log(error);
                    res.end("error");
                }else{
                        console.log("Message sent: " + response.message);
                    res.end("verification email sent. please check your inbox");
                    }
            });
            }
            });
         // }
        
    });
    
    // to verify the email address . link becomes useless/expires in 5 mins 
    app.get('/verify',function(req,res){
        console.log(req.protocol + ":/" + req.get('host'));
         
            connection.query('SELECT * from users where username = "'+req.query.username+'"', function(err, rows, fields) {
            if (!err)
                { 
                 if (req.query.id == rows[0].RAND) {
                    if(rows[0].CreatedOn.getTime() + 300*1000 > Date.now()){
                    console.log("email is verified");
                    
                      connection.query('update users set isverified="1" where username = "'+req.query.username+'"',
                        function(error,res){
                        if(!error){       
                        }
                        else{
                            console.log("error" + error);
                        }
                        });
                    
                        res.end("<h1>Email has been Successfully verified");
                     }else{
                         res.end("link expired");
                         connection.query('delete from users where username = "'+req.query.username+'"',function(er,response){
                            if(er) {
                                console.log(er);
                            }
                         })
                     }
                    }
                     else
                {
                     console.log("email is not verified");
                     res.end("<h1>Bad Request</h1>");
                }
                
                }
           
            });
           
    });

    
    // LOGOUT
    app.get('/logout', function(req, res) {
        if(req.cookies.username)
        res.clearCookie('username');
        res.redirect('/');
    });
};

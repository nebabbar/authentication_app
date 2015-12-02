
var mysql      = require('mysql');
var success = 0;

module.exports = function(req,res,callback){
	
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'paytm@197',
  database : 'sample'
});

//connection.connect();

var ispresent = 0;

connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err)
    { 
      console.log('The solution is: ', rows);
      for (var i = 0; i < rows.length; i++) {
       if(rows[i].USERNAME == req.body.email)
        {
          console.log(rows[i].USERNAME);
          ispresent = 1;
        }
          else{
          console.log("no");
        }
      };
      
     console.log("ispresent:" +ispresent);
  if(ispresent==0)
  {callback(null,1);}
  else
  {callback("err:already exists");} 
      
    }
  else
    {console.log('Error while performing Query.');
    callback("error while performing query");
    }
});

 /*if(ispresent==0){
        connection.query('Insert into users(username,password) values ("'+req.body.email +'","'+req.body.password+'")',
        function(err,res){
          if(!err){
            console.log("suc" + res);
            success =1;
          }
          else{
            console.log("error" + err);
          }
        });
        
      }*/
console.log("connection ends");
	//connection.end();
  
 
  
  
} 
var http = require("http");

var mysql = require("mysql");

var url = require("url");

var PORT = 8000; 

var fs = require("fs");

var socketio = require('socket.io');





var inquirer = require("inquirer");

var serverMan = http.createServer(handleRequest);

serverMan.listen(PORT, function() {

  // Callback triggered when server is successfully listening. Hurray!

  console.log("Server listening on: http://localhost:%s", PORT);

});

var connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else{
  connection = mysql.createConnection({

  host: "localhost",

  port: 3306,



  // Your username

  user: "root",



  // Your password

  password: "bigdad",

  database: "quiz"

});

};

connection.connect(function(err) {

  if (err) throw err;

  console.log("connected as id " + connection.threadId);

});









function handleRequest (req, res) {



	var urlParts = url.parse(req.url);

     

    switch (urlParts.pathname) {

     case "/":

      displayUser(urlParts.pathname, req, res);

      break;

    case "/manager":

      displayManager(urlParts.pathname, req, res);

      break;

    case "/superviser":

      displaySuperviser(urlParts.pathname, req, res);

      break;

    default:

      display404(urlParts.pathname, req, res);

    }



}







function displayUser(url, req, res) {

   fs.readFile("data.html", function(err, data) {

    data  += "<div><a href='/'>User</a></div>";

    data += "<div><a href='/manager'>Manager</a></div>";

    data += "<div><a href='/superviser'>Superviser</a></div>";

    // We then respond to the client with the HTML page by specifically telling the browser that we are delivering

    // an html file.

    res.writeHead(200, { "Content-Type": "text/html" });

    res.end(data);

  });

 

}





function displayManager(url, req, res) {

  var myHTML = "<html>";

  myHTML += "<body><h1>Manager</h1>";

  myHTML += "<div><a href='/'>User</a></div>";

  myHTML += "<div><a href='/manager'>Manager</a></div>";

  myHTML += "<div><a href='/superviser'>Superviser</a></div>";

  myHTML += "</body></html>";

  res.writeHead(200, { "Content-Type": "text/html" });



  res.end(myHTML);

}











function displaySuperviser(url, req, res) {

  var myHTML = "<html>";

  myHTML += "<body><h1>Superviser</h1>";

  myHTML += "<div><a href='/'>User</a></div>";

  myHTML += "<div><a href='/manager'>Manager</a></div>";

  myHTML += "<div><a href='/superviser'>Superviser</a></div>";

  myHTML += "<div></body></html>";

  res.writeHead(200, { "Content-Type": "text/html" });



  res.end(myHTML);

}





function display404(url, req, res) {

  res.writeHead(404, {

    "Content-Type": "text/html"

  });

  res.write("<h1>404 Not Found </h1>");

  res.end("The page you were looking for: " + url + " can not be found ");

}







var io = socketio.listen(serverMan);

io.sockets.on('connection', function(socket){

  //console.log("clinet connected!");

   

   socket.on('listfirst' , function(data){

     connection.query('SELECT * FROM products', function(err, res){

        if(err){

           throw err;

        }

        //console.log(res);

        

        var dataSQL = [] ;



        for (var i = 0; i < res.length; i++) {

        var x = "USER"+i+" : " + res[i].quiz_1 + " | " + res[i].quiz_2 + " | " + res[i].quiz_3 + " | " + res[i].quiz_4
        +  " | "+ res[i].quiz_5;

        dataSQL.push(x);

        }

           

        

        socket.emit('firstlist', dataSQL); 

        //console.log(res); 

        /*

        connection.end(function(err){

          if(err)

            throw err; 



        }); 

        */  

     });

    

  });

  



  
socket.on('compareMan' , function(data){
   connection.query('SELECT * FROM products', function(err, res){

        if(err){

           throw err;

        }

       

        

        var dataSQL = [] ;

       
        var x = res[0].quiz_1 -res[1].quiz_1;
        var y = res[0].quiz_2 -res[1].quiz_2;
        var z = res[0].quiz_3 -res[1].quiz_3;
        var s = res[0].quiz_4 -res[1].quiz_4;
        var d = res[0].quiz_5 -res[1].quiz_5;
        

       
        dataSQL.push(x);
        dataSQL.push(y);
        dataSQL.push(z);
        dataSQL.push(s);
        dataSQL.push(d);

        socket.emit('receiverCom', dataSQL); 

           

        

        

        //console.log(res); 

        /*

        connection.end(function(err){

          if(err)

            throw err; 



        }); 

        */  

     });

   






});  




  



  socket.on('rint' , function(data){

          console.log(data);
         
          connection.query( "UPDATE products SET  ? WHERE ?", [{quiz_1: data[0]},{ item_id : data[5]+1}] ,function (err, res) {

                if (err) {

                  throw err;

                }



          console.log('SUCCESS, updated ', res.affectedRows, 'rows');

          });

           connection.query( "UPDATE products SET  ? WHERE ?", [{quiz_2: data[1]},{ item_id : data[5]+1}] ,function (err, res) {

                if (err) {

                  throw err;

                }



          console.log('SUCCESS, updated ', res.affectedRows, 'rows');

          });

          connection.query( "UPDATE products SET  ? WHERE ?", [{quiz_3: data[2]},{ item_id : data[5]+1}] ,function (err, res) {

                if (err) {

                  throw err;

                }



          console.log('SUCCESS, updated ', res.affectedRows, 'rows');

          });

          connection.query( "UPDATE products SET  ? WHERE ?", [{quiz_4: data[3]},{ item_id : data[5]+1}] ,function (err, res) {

                if (err) {

                  throw err;

                }



          console.log('SUCCESS, updated ', res.affectedRows, 'rows');

          });

          connection.query( "UPDATE products SET  ? WHERE ?", [{quiz_5: data[4]},{ item_id :data[5]+1}] ,function (err, res) {

                if (err) {

                  throw err;

                }



          console.log('SUCCESS, updated ', res.affectedRows, 'rows');

          });


        


        socket.emit('goback');



  });



  



});















/*

connection.query('select * from products ', function(err, res){

       if(err){

        throw err;

       }



        //console.log(res);



        connection.end(function(err){

        if(err)

    	throw err; 



    }); 



});

*/
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var aut;
var id;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret key'))

const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "mysql",
  database: "GolovinDE",
  password: "mysql"
});
 
app.set("view engine", "hbs");
 
app.get("/", async function(req, res){
	var a1 = await users();
	var a2 = await pricelist();
	
	if (req.cookies['hash'] != '')
		id = req.cookies['hash'];
	else id = '';

    res.render("site3.hbs", {
          users: a1, 
		  pricelist: a2		  
    });
});
 
app.get("/1", async function(req, res){
	aut = 1;
	var a1 = await users();
	var a2 = await selectlist();
	
	if (req.cookies['hash'] != '')
		id = req.cookies['hash'];
	else id = '';

    res.render("site3.hbs", {
          users: a1, 
		  pricelist: a2		  
    });
});

app.get("/2", async function(req, res){
	aut = 2;
	var a1 = await users();
	var a2 = await selectlist();
	
	if (req.cookies['hash'] != '')
		id = req.cookies['hash'];
	else id = '';

    res.render("site3.hbs", {
          users: a1, 
		  pricelist: a2		  
    });
});

app.get("/3", async function(req, res){
	aut = 3;
	var a1 = await users();
	var a2 = await selectlist();
	
	if (req.cookies['hash'] != '')
		id = req.cookies['hash'];
	else id = '';

    res.render("site3.hbs", {
          users: a1, 
		  pricelist: a2		  
    });
}); 
 
app.get("/pomoyka", function(req, res){
	var name; 
	var userid;
	if (req.cookies['hash'] != ''){
    pool.query("SELECT name FROM hash WHERE hash= '" + id + "'", function(err, data2) {
            if (err) return console.log(err);  
			name = data2[0].name;
			pool.query("SELECT id FROM users WHERE name= '" + name + "'", function(err, data3) {
                 if (err) return console.log(err);  
			     userid = data3[0].id;
			         pool.query("SELECT basket.id, amount, image, user, price, name FROM basket JOIN pricelist ON pricelist.id = basket.idp WHERE user= '" + userid + "'", function(err, data) {
                          if(err) return console.log(err);
			              console.log(data);
	                      res.render("pomoyka.hbs", {
                          basket: data
						  });
			});
        });
    });}
	else res.redirect("/");
}); 
 

 app.post("/add/:id", function(req, res){
  var name;   
  var userid;  
  const idp = req.params.id;
  const amount = req.params.amount;
  if (req.cookies['hash'] != ''){
  pool.query("SELECT name FROM hash WHERE hash= '" + id + "'", function(err, data2) {
            if (err) return console.log(err);  
			name = data2[0].name;
			   pool.query("SELECT id FROM users WHERE name= '" + name + "'", function(err, data3) {
                       if (err) return console.log(err);  
			           userid = data3[0].id;		 
			                 pool.query("INSERT INTO basket (idp, user, amount) VALUES (?,?,?)", [idp, userid, amount], function(err, data) {
                                   if(err) return console.log(err);
	                               console.log(idp);
                                   res.redirect("/");
							 });
            });
  });}
  else { 
	  res.redirect("/");
	  console.log("Вы не авторизованы для покупок!");
  }
});
 
app.post("/deleteuser/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/useredit");
  });
}); 


app.get("/edit/:id", function(req, res){
  const id = req.params.id;
  pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
     res.render("edit.hbs", {
        user: data[0]
    });
  });
});

app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const admin = req.body.admin;
  const id = req.body.id;
   
  pool.query("UPDATE users SET name=?, admin=? WHERE id=?", [name, admin, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});
 
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM basket WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/pomoyka");
  });
});
 
app.get("/create", function(req, res){
    res.render("reg.hbs");
});

app.get("/admin", function(req, res){
	var name;
	var admin;
	if (req.cookies['hash'] != ''){
        pool.query("SELECT name FROM hash WHERE hash= '" + id + "'", function(err, data2) {
            if (err) return console.log(err);  
			name = data2[0].name;
			pool.query("SELECT admin FROM users WHERE name= '" + name + "'", function(err, data) {
                  if (err) return console.log(err);  
				  admin = data[0].admin;
			      if (admin == 1) res.render("admin.hbs");
				  else res.redirect("/");
		    });
		});
	};	
});

app.get("/product", function(req, res){
	var name;
	var admin;
	if (req.cookies['hash'] != ''){
        pool.query("SELECT name FROM hash WHERE hash= '" + id + "'", function(err, data2) {
            if (err) return console.log(err);  
			name = data2[0].name;
			pool.query("SELECT admin FROM users WHERE name= '" + name + "'", function(err, data) {
                  if (err) return console.log(err);  
				  admin = data[0].admin;
			      if (admin == 1)
				  {
					  pool.query("SELECT * FROM pricelist", function(err, data) {
                         if(err) return console.log(err);
                         res.render("products.hbs", {
                                 pricelist: data
                                });
                            });
				  }
				  else res.redirect("/");
		    });
		});
	};	
    
});

app.get("/useredit", function(req, res){
	var name;
	var admin;
	if (req.cookies['hash'] != ''){
        pool.query("SELECT name FROM hash WHERE hash= '" + id + "'", function(err, data2) {
            if (err) return console.log(err);  
			name = data2[0].name;
			pool.query("SELECT admin FROM users WHERE name= '" + name + "'", function(err, data) {
                  if (err) return console.log(err);  
				  admin = data[0].admin;
			      if (admin == 1)
				  {
					  pool.query("SELECT * FROM users", function(err, data) {
                         if(err) return console.log(err);
                         res.render("index.hbs", {
                                 users: data
                                });
                            });
				  }
				  else res.redirect("/");
		    });
		});
	};	
    
});

app.post("/create", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const pas = req.body.pas;
	if (name == '' || pas == '') 
	{
		console.log('Поля логина или пароля пусто!');
		res.redirect("/create");
	}	
    else	
	pool.query("SELECT name FROM users WHERE name= '" + name + "'", function(err, data) {
		console.log(data);
		if (data == '')
		{
			console.log('successful');
			pool.query("INSERT INTO users (name, pas) VALUES (?,?)", [name, pas], function(err, data) {
              if(err) return console.log(err);
			  hash = getRandomInt(1000001);
			  id = hash;
			  res.cookie('hash', hash);
	          console.log(name + ' = ' + hash);  
	          console.log(id); 
			  pool.query("INSERT INTO hash (name, hash) VALUES (?,?)", [name, hash], function(err, data) {
              if(err) return console.log(err);  
			  });
              res.redirect("/");	  
            });
		}
		else
		{
			console.log("Такой пользователь уже существует!");
			res.redirect("/create");	
		}
	});
    
});

app.get("/login", function(req, res){
	res.render("login.hbs");	
});

app.post("/login", urlencodedParser, function (req, res) {
    var hash;    
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const pas = req.body.pas;
	if (name == '' || pas == '')
	{
		console.log('Поля логина или пароля пусто!');
		res.redirect("/login");
	}
	else
    pool.query("SELECT pas FROM users WHERE name= '" + name + "'", function(err, data) {
      if(err) return console.log(err);
	  if (data == '')
		console.log('ID пуст');
	  else
	  console.log(data[0].pas);
      if (pas == data[0].pas)
	  {
	  console.log('successful');  
	  hash = getRandomInt(1000001);
	  id = hash;
	  res.cookie('hash', hash);
	  console.log(name + ' = ' + hash);  
	  console.log(id); 
	  pool.query("INSERT INTO hash (name, hash) VALUES (?,?)", [name, hash], function(err, data) {
              if(err) return console.log(err);
              res.redirect("/");	  
            });
	  }
	  else
	  {
	  console.log('пароль не подошёл!')
      res.redirect("/login");
	  }
    });
}); 
 
 app.get("/createuser", function(req, res){
    res.render("create.hbs");
});
app.post("/createuser", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const pas = req.body.pas;
    pool.query("INSERT INTO users (name, pas) VALUES (?,?)", [name, pas], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/useredit");
    });
});
 
 
app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});

function users()
{
    return new Promise((resolve, reject) => {
	pool.query("SELECT name FROM hash WHERE hash= '" + id + "'", function(err, data) {
            if (err){
                console.log("Error: " + err);
                reject(err);
            }
            resolve(data)
        })
    })
}

function pricelist()
{
    return new Promise((resolve, reject) => {
	pool.query("SELECT * FROM pricelist", function(err, dataprice)  {
            if (err){
                console.log("Error: " + err);
                reject(err);
            }
            resolve(dataprice)
        })
    })
}

function selectlist()
{
    return new Promise((resolve, reject) => {
	pool.query("SELECT * FROM pricelist where description= '" + aut + "' ", function(err, dataprice)  {
            if (err){
                console.log("Error: " + err);
                reject(err);
            }
            resolve(dataprice)
        })
    })
}
 
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


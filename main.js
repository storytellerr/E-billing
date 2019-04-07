var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var date = require('date-and-time');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

var connection = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'123',
  database:'ebill'
});
connection.connect(function(error) {
  if(!!error){
    console.log('Error');
  }
  else{
    console.log('Connected');
  }
});

var items
connection.query('SELECT * FROM ITEM', function(err, rows){
	if(err) throw err;
	if(rows.length > 0){
		items = rows;
	}
	else{
		items = null;
	}

});

var date = date.format(new Date, 'DD-MM-YYYY');
console.log(date);


app.get('/', function(req, res){
	res.render('index', { title : 'Dashbord' });
});

app.get('/inventory.ejs', function(req, res){
	res.render('inventory', 
		{ 
			title : 'Items',
			items : items 
		});
});

app.get('/index.ejs', function(req, res){
	res.render('index', { title : 'Dashbord' });
});

app.post('/index.ejs', urlencodedParser, function(req, res){
	console.log(req.body);
	var purchase = req.body;
	for(var i=0; i<purchase.qty.length; i++){
		if(purchase.qty[i] === ''){
			purchase.qty.splice(i,1);
			i--;	
		}
	}
	var ttl = purchase.ch.length;
	var cnt = 0;
	// console.log(typeof purchase.qty[0]);
	// console.log(purchase.ch.length);
	for(var a=0; a<purchase.ch.length; a++){
		connection.query("SELECT * FROM ITEM WHERE item_name='"+purchase.ch[a]+"'", function(err, rows){
	  		if(err) throw err;
	  		if(rows.length>0){
	  			console.log(rows);
	  			var it = rows[0];
	  			//console.log(purchase.qty[a]);
	  			//console.log(purchase.qty[cnt++]);
	  			//console.log('hello world');
	  			var nprice = it.price * purchase.qty[cnt++];
				console.log(nprice);
				
				//connection.query("insert into purchase(item_id, item_name, description, price, date) values(?,?,?,?,?)", [it.item_id, it.item_name, it.description, nprice, new Date()]);
	  		}
	  	});
	  	console.log(a);
	}
	// for(var i=0; i<purchase.qty.length; i++){
	// 	console.log(i)
  		
	// }
	res.render('index', { title : 'Dashbord' });
	
});

app.listen(3000);
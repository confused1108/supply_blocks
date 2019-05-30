const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const config = require('./config');

const app = express();

app.set('view engine' , 'ejs'); 

app.listen(config.PORT , () => {
	mongoose.connect('mongodb://localhost/order_chain');
});

var db = mongoose.connection;

db.on('error', (err) => console.log(err));

const TransportersSchema = new mongoose.Schema({
	name : {type : String , required : true},
	from_place : {type : String , required : true},
	to_place : {type : String , required : true},
	obtain_from : {type : String , required : true},
	give_to : {type : String , required : true}
});

const OrderSchema = new mongoose.Schema({
	seller_detail : {type : String , required : true},
	buyer_detail : {type : String , required : true},
	product_details : {type : Object , required : true},
    transporter_details : TransportersSchema
});

TransportersSchema.plugin(timestamp);
OrderSchema.plugin(timestamp);

const Order = mongoose.model('Order', OrderSchema , 'Order');

db.once('open' ,() =>{

	app.get('/' , (req , res) => {
		
		var array =[];
	var r = Math.floor(100000000 + (Math.random()*99999999));
	if(array.indexOf(r) === -1) array.push(r);
    console.log(array);
	});

	app.post('/add/order_details' , urlencodedParser , (req , res) => {
 		const {seller_detail , buyer_detail , product_details , name , from_place , to_place , 
 			   obtain_from , give_to} = req.body;
		const order = Order({seller_detail , buyer_detail , product_details , transporter_details :{name , from_place , to_place , 
							 obtain_from , give_to}}).save(err => console.log(err));
	});

	app.get('/order_details/:id', urlencodedParser , (req , res) => {
		const {seller_detail , buyer_detail , product_details , name , from_place , to_place , 
 			   obtain_from , give_to} = req.body;
 		const query = {_id:rrq.params.id};
 		Order.find(query,function(err,order){
 			if(err) throw err;
 			if(order.length ==0){
 				console.log('No such order exists');
 				res.send('No such order exists');
 			}
 			if(order.length >0){
 				
 			}
 		});
});

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
	tid: {type : Number , required : true},
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

const NodeSchema = new mongoose.Schema({
	tid : {type : Number , required : true},
	name : {type : String , required : true},
	msgs : {type : Array , required : true}
});

TransportersSchema.plugin(timestamp);
OrderSchema.plugin(timestamp);
NodeSchema.plugin(timestamp);

const Node = mongoose.model('Node', NodeSchema , 'Node');
const Order = mongoose.model('Order', OrderSchema , 'Order');

db.once('open' ,() =>{

	app.get('/' , (req , res) => {
		res.render('homepage');
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
 		const query = {_id:req.params.id};
 		Order.find(query,function(err,order){
 			if(err) throw err;
 			if(order.length ==0){
 				console.log('No such order exists');
 				res.send('No such order exists');
 			}
 			if(order.length >0){
 				res.send(order[0]);
 			}
 		});
});

app.get('/transporter' , (req,res) => {
        Order.find({},function(err,data){
			if(err) throw err;
			if(data.length ==0){
				console.log('No order exists');
			}
			if(data.length>0){
				for(let k=0;k<data.length;k++){
					const val = data[k].transporter_details;
					const tid = val.tid;
					const name = val.name;
					const msgs = [{obtain_from:val.obtain_from,give_to:val.give_to}];
					const node1 = Node({name:name,tid:tid,msgs:msgs}).save(function(err){
						if(err) throw err;
					});
				}
			}
		});
});


	app.get('/transporter/:id' , function(req,res){
      
        const query = {tid:req.params.id};
	    Node.find(query, function(err,node){
      	if(err) throw err;
      	res.render('transporterPage',{data:node});
      });
	});

});


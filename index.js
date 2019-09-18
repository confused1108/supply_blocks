const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const nodemailer = require('nodemailer');
const {Keccak} = require('sha3');
const fs = require('fs');
const qrcode = require('qrcode');
var cache = require('memory-cache');
const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const hash = new Keccak(256);

const app = express();

app.set('view engine' , 'ejs');

app.use(express.static('./public'));

mongoose.connect('mongodb://localhost/order_chain');

var db = mongoose.connection;

//databases

//1-Company Schema
const CompanySchema = new mongoose.Schema({
	cname : String ,
	website :  String ,
	email : String ,
	number :  Number , 
	password : String , 
});

//2-Individual User Schema
const IndSchema = new mongoose.Schema({
	firstname :  String ,
	lastname : String ,
	email :  String , 
	number : Number , 
	password :  String , 
});

//3-Packages and Api Schema
const PackageSchema = new mongoose.Schema({
	packagetype:String ,
	cid :  String ,
	email :  String ,
	bookdate : String , 
	total :  Number , 
	no :  Number , 
});

//4-Cities Schema
const citiesSchema = new mongoose.Schema({
	city_name :  String ,
	city_id : String ,
});

//5-Database of connection between cities
const GraphNodesSchema = new mongoose.Schema({
	nodes : Array,
});
const connections_finalSchema = new mongoose.Schema({
	Conn_id:Number,
	Source:Number,
	Destination:Number,
	Distance:Number,
	time_const:Number,
	cost_constant:Number
});

//6-Order Schema called when new order placed 
const OrderSchema = new mongoose.Schema({
	order_id :  Number ,
	noid : Number, 
	seller_detail : String,
	buyer_detail : String,
	product_details : String,
    transporter_details : Array 
});

//7-Transporter Schema
const transporterSchema = new mongoose.Schema({
	//order : {type: mongoose.Schema.Types.ObjectId , ref:'TransOrder'}, //contains all the orders one transporter gets
	transporter_name : String,
	transporter_id : Number,
	city_id : Number,
	number : Number ,
});

//8-Database for each order each transporter gets
const TransOrderSchema = new mongoose.Schema({
	transporter_id : Number ,
	order_id : Number , 
	noInChain : Number ,
	msgs : String , 
	pubKey :  { type: Object, default: {} },
	tx : String ,
	approved : {type : Boolean , default : false},
	verify: {type : Boolean ,default : false },
	flag : String,
} , { minimize: false });

//9-OrderCrypto database to store p,g,a,hash details
const OrderCryptoSchema = new mongoose.Schema({
	order_id :Number,
	pvalue : Number,
	gvalue : Number,
	hashvalue: Number,
	convertedHash : String,
	getid : Number,
    tx : String,
	flag : Boolean
});

//10-Admin Database
const AdminSchema = new mongoose.Schema({
	name : String , 
	email : String 
});

// const NodeSchema = new mongoose.Schema({
// 	name : {type : String , required : true},
// 	number : {type : Number , required : true},
// 	obtain_from : {type : String , required : true},
// 	give_to : {type : String , required : true}
// });
 
CompanySchema.plugin(timestamp);
IndSchema.plugin(timestamp);
PackageSchema.plugin(timestamp);
transporterSchema.plugin(timestamp);
OrderSchema.plugin(timestamp);
//NodeSchema.plugin(timestamp);

//const Node = mongoose.model('Node', NodeSchema , 'Node');
const GraphNodes = mongoose.model('GraphNodes', GraphNodesSchema , 'GraphNodes');
const Order = mongoose.model('Order', OrderSchema , 'Order');
const Company = mongoose.model('Company', CompanySchema , 'Company');
const Ind = mongoose.model('Ind', IndSchema , 'Ind');
const Package = mongoose.model('Package', PackageSchema , 'Package');
const transporter = mongoose.model('transporter', transporterSchema , 'transporter');
const connections_final = mongoose.model('connections_final', connections_finalSchema , 'connections_final');
const cities= mongoose.model('cities', citiesSchema , 'cities');
const OrderCrypto = mongoose.model('OrderCrypto', OrderCryptoSchema , 'OrderCrypto');
const Admin = mongoose.model('Admin', AdminSchema , 'Admin');
const TransOrder = mongoose.model('TransOrder', TransOrderSchema , 'TransOrder');


//1
//Company registration
app.post('/user/:cname/:website/:email/:number/:password',function(req,res){
	const {cname , website , email , number , password} = req.params ;  
	const company = Company({cname , website , email , number , password}).save(err => console.log(err));
});

//2
//Company login
app.get('/searchuser/:email/:password',function(req,res){
   
	const {email , password} = req.params ; 
	const query = {email : email , password  : password};
	Company.find(query , function(err , user){
		if(err) throw err;
		res.send(user[0]);
	});
});

//3
//Individual user registration
app.post('/induser/:firstname/:lastname/:email/:number/:password',function(req,res){
    
	const {firstname , lastname , email , number , password} = req.params ;  
	const ind = Ind({firstname , lastname , email , number , password}).save(err => console.log(err));
});

//4
//Individual user login
app.post('/searchinduser/:email/:password',function(req,res){

	const {email , password} = req.params ; 
	const query = {email : email , password  : password} ;
	Ind.find(query , function(err , user){
		if(err) throw err;
		res.send(user);
	});
});

//5
//Packages and apis purchased by a company
app.post('/addpackage/:email/:bookdate/:no/:days/:packagetype/:cid',function(req,res){

	const {email , bookdate , no ,days , packagetype , cid} = req.params;
	const package = Package({email:email , bookdate : bookdate , total : days , no : no ,
		packagetype : packagetype ,cid:cid}).save(function(err){
		if(err) throw err;
	});
	res.send('done');

});

//6 
//API trigger and check conditions
app.post('/check/:id',urlencodedParser,function(req,res){

	const pid = req.body.pid;
	var i=0,m=0;var errors = [],dat=[],array=[];
	const query = {_id : req.params.id};
	Company.find(query,function(err,user){
		console.log(req.params.id);
		if(err) throw err;
		if(user.length == 0){
			console.log('No such user exists');//if no such company is already present in database
			res.send('No such user exists');
		}
		if(user.length>0){
			console.log('You are logged in');
			const query2= {cid:user[0]._id};
			Package.find(query2,function(err,usr){
				if(err) throw err;
				if(usr.length == 0 ){
					console.log('No Package Exists');//if the company has no package present
					res.send('No Package Exists');
				}
					if(usr.length > 0){
					console.log('U have some Packages in your account');
	 				const query3 = {_id : pid};
					Package.find(query3,function(err,package){
						if(err) throw err;
						if(package.length ==0){
							console.log('No such package for this id exists');
							//if company has packages but no package of that id exists
							res.send('No such package for this id exists');
						}
						if(package.length>0){
						console.log('Package for this id found')
						for(let k = 0; k < package.length ; k++){

							    const date = (new Date()).getTime();
								const checkdate = (new Date(package[k].bookdate)).getTime();
								const diff = Math.floor((Math.abs(Number(date) - Number(checkdate)))/86400000);
								if(package[k].no==0){
									console.log('All used for package type' + package[k].packagetype);
									//if number of apis available for that package is 0
									errors[i]='All used for package type' + package[k].packagetype;
									i++;
								}
								else if(diff >=  package[k].total){
									console.log('Date of use expired for package type'  + package[k].packagetype);
									//if package use date is expired
									errors[i] = 'Date of use expired for package type'  + package[k].packagetype;
									i++;
									
								}
								else {
									//if all 4 conditions are verified
									console.log('Api available');
									console.log('Date not expired');
									dat[m] = package[k];
									m++;
								}
						}
						console.log();console.log(dat);errors
						res.send(dat);
						
				}});
			}
});}

}); });

//7
//generate GraphNodes having connections between cities

var Graph = require('node-dijkstra');
var route = new Graph();
var i=1;
var arr =[];

app.get('/',function(req,res){

	connections_final.find({},function(err,data){
		if(err) throw err;
		
		if(data.length>0)
		{
			while(i<57){
				var string = '';
				string = 'route.addNode("' + i  + '", {';
				for(let j=0;j<data.length;j++){
					if(data[j].Source == i){
						var factor =  ( data[j].Distance * data[j].time_const );
						 string += data[j].Destination + ':' + factor + ',';
					}}
					string = string.substring(0, string.length - 1);
				    string += '})';
				    eval(string);
				    arr.push(string);
				    i++;
			}
		}
		var node = GraphNodes({nodes : arr}).save(function(err){
			if(err) throw err;
		});
		console.log('Graph saved');
			
 });
});


//8
//placing a new order and generating array of transporters
var node1 = 0 , node2 = 0;
var v ='';
function call(v){
	return v;
}
var finalarray =[];

app.get('/placeorder' , urlencodedParser , function(req,res){

	const {seller_detail , buyer_detail , product_details} = req.body;
	var store = (new Date()).getTime();
	var order_id = call(store);
	const query1 = {city_name : seller_detail};
	const query2 = {city_name : buyer_detail};
	//using database of cities 
	cities.find(query1,function(err,data){
		if(err) throw err;
		if(data.length > 0){
				node1 = data[0].city_id;
				cities.find(query2,function(err,data){
					if(err) throw err;
					if(data.length > 0){
						node2 = data[0].city_id;
						//using GraphNodes database to find the connection array between buyer and seller city
						GraphNodes.find({},function(err,data){
							if(err) throw err;
							if(data.length>0){
								array1 = data[0];
								eval(array1);
								finalarray = route.path(node1,node2);
								finalarray.unshift(250);
								var len = finalarray.length;
								finalarray[len] = 251;
								console.log(finalarray);
								//placing the order now and storing in Order database
								var order = Order({ order_id , seller_detail , buyer_detail , product_details,
													transporter_details : finalarray});
								return order.save()
								.then(res => {
									//after placing order send notifications to all about the order 
		                        	sendNotification(order_id , finalarray);
								});
	
						} });
				    } });
	}   });
});

//9
//Reducing the total number of apis company has after use
app.get('/package/:id',function(req,res){

	const query = {_id : req.params.id};
	Package.find(query,function(err,data){
		if(err) throw err;
		if(data.length>0){
			const newno = Number(data[0].no) -1;
			Package.update(query,{no:newno},function(err){
				if(err) throw err;
				console.log('Updated');
			});
			Package.find(query,function(err,data){
				if(err) throw err;
				if(data.length>0){
				console.log(data[0])}
			})
		}
	});
});

//10
// Send Notifications to all nodes in chain
var trans_arr =[]; var iid='';

function sendNotification(iid,trans_arr){
 
   console.log(iid , trans_arr);
   console.log('stage1');
 
   var nid = iid;
   console.log(nid);
   var i=1;
   // for seller
   var queryS = {transporter_id : Number(trans_arr[0])};
   var queryS1 = {transporter_id : Number(trans_arr[1])};

   //use transporter database to find transporters and then notify them
   transporter.find(queryS1,function(err,data){
    	if(err) console.log('error');
    	console.log('stage2');
    	if(data.length>0){
    	var seller_give = 	data[0].transporter_name;
    	var msgS = 'Give the product to ' + seller_give;
    	console.log(msgS);
        // var toinputS = {transporter_id : Number(trans_arr[0]) , order_id : nid , msgs : msgS , 
        // 				flag : false , noInChain : 0 , pubKey:{} , tx : ''};
     	const order = TransOrder({transporter_id : Number(trans_arr[0]) , order_id : nid , msgs : msgS , 
        				flag : 'true' , noInChain : 0 , pubKey:{} , tx : ''}).save(function(err){
        					if(err) throw err;
        					console.log('order placed in transporter database');
        				});
     	// order.save(function(err){
     	// 	if(err) throw err;
     	// 	const transporter = transporter({transporter_id : Number(trans_arr[0]),order:order._id});
     	// 	transporter.save(function(err){
     	// 		if(err) throw err;
     	// 	});
     	// });
   //  	transporter.updateOne(queryS, {$set : {orders : toinputS}} ,function(err){
   //  	  	if(err) console.log('Error0');	
			// console.log('updated');
   //  	  });
    	}
    	 }).then(res => {
   		// call the function to store hash of order_id
   		Crypto(iid);
   	}).then(res => {
   		//call the function to notify all except seller
   		repeat(trans_arr,i,nid);
   	});
					
}


//function to notify all except seller
var ary2 = [];var y=0;var ordid = 0;var obtain_from = '';
function notifyAll(ary2,y,ordid){
  var nid = ordid;
  console.log(nid);
  if(y==ary2.length-1){
  	 transporter.find({transporter_id : Number(ary2[y-1]) })
  	 	.then(data1 => {
		var obtain_from = data1[0].transporter_name;
		console.log(obtain_from);
		var msg = 'Take from ' + obtain_from;
		if(nid != 0){

		const order = TransOrder({transporter_id : Number(ary2[y]) , order_id : nid , msgs : msg , 
								flag : 'false' , noInChain : y , pubKey:{} , tx : ''})
							.save(function(err){
        					if(err) throw err;
        				});
     	// order.save(function(err){
     	// 	if(err) throw err;
     	// 	const transporter = transporter({transporter_id : Number(ary2[y]),order:order._id});
     	//     transporter.save();
     	// });
     	}
		// {var toinput = {tx : '',pubKey:{},transporter_id : Number(ary2[y]) , order_id : nid , msgs : msg , flag : false , noInChain : y };}

		//return transporter.updateOne({transporter_id : Number(ary2[y])},{$set : {orders:toinput}});
	}).then(input => {
			console.log('updated');
			return transporter.find({transporter_id : Number(ary2[y])});
		}).then(data3 => {
			console.log(data3);
			return repeat(ary2 , y+1 , nid);
		})
  } else {
  transporter.find({transporter_id : Number(ary2[y-1]) })
  	.then(data1 => {
		var obtain_from = data1[0].transporter_name;
		console.log(obtain_from);
		//return transporter.find({transporter_id : Number(ary2[y+1])});
		return obtain_from;
	}).then(obf => {
				transporter.find({transporter_id : Number(ary2[y+1])},function(err,data2){
					if(err) throw err;
					console.log(data2);
					var give_to = data2[0].transporter_name;
					console.log(give_to);
					var msg = 'Obtain from ' + obf + ' and give to ' + give_to;
					//console.log(msg);
					const order = TransOrder({transporter_id : Number(ary2[y]) , order_id : nid , msgs : msg , 
        				flag : 'false' , noInChain : y , pubKey:{} , tx : ''}).save(function(err){
        					if(err) throw err;
        				});
					//return msg;
				});
				
	}).then(res =>{
		// if(nid != 0){
		// 	console.log('Kya yha aara h');
		// const order = TransOrder({transporter_id : Number(ary2[y]) , order_id : nid , msgs : msg , 
  //       				flag : false , noInChain : y , pubKey:{} , tx : ''}).save(function(err){
  //       					if(err) throw err;
  //       				});
     	// order.save(function(err){
     	// 	if(err) throw err;
     	// 	const transporter = transporter({transporter_id : Number(ary2[y]),order:order._id});
     	//     transporter.save();
     	// });
        //}
        console.log('each transporter msg updated');
	})
				// console.log(data2);
				// var give_to = data2[0].transporter_name;
				// console.log(give_to);
				// var msg = ' Give to ' + give_to;
				// console.log(msg);
				// if(nid != 0)
				// {var toinput = {tx : '',pubKey:{},transporter_id : Number(ary2[y]) , order_id : nid , msgs : msg , flag : false , noInChain : y };}
				// return transporter.updateOne({transporter_id : Number(ary2[y])},{$set : {orders:toinput}});
		.then(input => {
			console.log('updated');
			return transporter.find({transporter_id : Number(ary2[y])});
		}).then(data3 => {
			console.log(data3);
			return repeat(ary2 , y+1 , nid);
		})
}}

//function to call notify all again till end of chain
var amount = 0;var ary=[];var orid = 0;
function repeat(ary,amount,orid){
	console.log('yooojoo');
	if(amount>=ary.length){
		console.log('DONE!!');
		return;
	}
	console.log(orid);
	return notifyAll(ary,amount,orid);

}


var oid ='';var no = 0;

//calling P,G,a generating functions
function Crypto(oid){
	console.log('came' + oid);
	var values = forP(oid);
	const hashvalue = values[3];
	console.log(values[4]);
	console.log(hashvalue);
    var f = '"' + hashvalue + '"';
    console.log(f);
    hash.update(f);
    var  convertedHash = hash.digest('hex');
    hash.reset();
    //call OrderCrypto database to store p,g,a,hash details
	var cryto1 = OrderCrypto({ order_id : oid , pvalue : values[1] , gvalue : values[2] ,
							   hashvalue : values[3] , convertedHash , flag : false
							}).save(function(err){
								if(err) throw err;
							});
	console.log('Updated');
}

//functions to get P , G, a and hash value
var val = 0;var array=[];
function forP(val){
	var num = 0;var final = 0;
    var prime = 0;var result= 0 ;var ans=0;
    function toBinary(n){
        var array=[]; var array2=[];
        var i = 0; 
        while (n > 0) { 
            array[i] = n % 2; 
            n = Math.floor(n / 2); 
            i++; 
        }
        var k=0;
        for (var j = i - 1; j >= 0; j--) {
            array2[k] = array[j];
            k++;
    } 
        return array2;
    }

    function isPrime(num){
        var i,flag=0;
        for(i=2; i <= num/2; i++){
            if(num%i == 0){
                flag = 1;
                break;
            }
        }
            if(flag==0)
                final=num;
            else
                isPrime(num+1);
                
            return final;
    }

    function count(answer){
        var count=0;
        for(var m=0;m<answer.length;m++){
            if(answer[m]==1){count++};
        }
        return count;
    } 

    function findPrimefactors (num) {
        var primeFactors = [];
        while (num % 2 === 0) {
            primeFactors.push(2);
            num = num / 2;
        }
        var sqrtNum = Math.sqrt(num);
        for (var i = 3; i <= sqrtNum; i++) {
            while (num % i === 0) {
                primeFactors.push(i);
                num = num / i;
            }
        }

        if (num > 2) {
            primeFactors.push(num);
        }
        return primeFactors;
    }

    function power(x,y,p){
        var res = 1;
        x=x%p;
        while(y>0){
            if(y & 1)
                {res = (res*x)%p;}
        
        y = y/2;
        x=(x*x)%p;
        }
        if(res==1)
        return 1;
        else
        return 0;
    }

    function findPrimitive(n){
        var powers=[];
        var phi = n-1;
        var array= findPrimefactors(phi);
        for(var f=0;f<array.length;f++){
        powers[f] = phi/array[f];
        }
        for (var r=2; r<=phi; r++) 
        {
            c=0;
            for(var nn=0;nn<powers.length;nn++){
                if(power(r, powers[nn], n) == 1 ){
                    c=1;
                }
            }
            if(c==0) return r;

        }
    }

    var i=0,j=0,k=0;
	function calculateHash(i,j,k){
        var c1 = Math.pow(i,k);
        var c2 = c1 % j;
        return c2;
    }
 
    var answer = toBinary(Number(val));
    var prime = count(answer);
    var ans = isPrime(prime);//gives P
    var result = findPrimitive(ans);//gives G
    var a = Math.floor(Math.random()*38 + 40);//gives a
    console.log(a);
    var hash = calculateHash(result,ans,a); //gives hash
    array.push(val);
    array.push(ans);
    array.push(result);
    array.push(hash);
    array.push(a);
    return array;

}

//11
// get admin login page
app.get('/admin/:name/:email',function(req,res){
	const query = {name : req.params.name , email : req.params.email};
	//check Admin database for the authentication of the person trying to log in
	Admin.find(query , function(err,data){
		if(err) throw err;
		if(data.length > 0){
			res.send(data[0]);
		}
	});
});

//12
// get admin orders page for approval to call smart contract then ans store the hash on blockchain
app.get('/fetchorders' , function(req,res){
	const query = {flag : false};
	OrderCrypto.find(query , function(err,data){
		if(err) throw err;
		if(data.length > 0){
			res.send(data);
		}
	});
});

//13
// get returned transaction hash from contract
app.get('/returntx/:id/:hash/:tx/:getid' , function(req,res){
	const query = {order_id:req.params.id};
	console.log('TX:' + req.params.tx);
	console.log('ID'+ req.params.getid);
	OrderCrypto.updateOne(query , {flag : true , tx : req.params.tx , getid : Number(req.params.getid)} ,function(err){
		if(err) throw err;
		console.log('tx stored');
	});
	res.redirect('/fetchorders');
});

//14
// get transporter profile page with id
app.get('/transporter/:id' , function(req,res){

    var query = {transporter_id:Number(req.params.id)};
    //find transporter in transporter database
  	TransOrder.find(query,function(err,data){
  	if(err) console.log(err);
  	if(data.length>0){
  		console.log('found',data);
  	res.send(data);
  }
  });
});

//15
//get seller profile page with id
app.get('/seller/:id' , function(req,res){
 
    var query = {transporter_id:Number(req.params.id)};
    //find seller in transporter database
  	TransOrder.find(query,function(err,data){
  	if(err) console.log(err);
  	if(data.length>0){
  		console.log(data);
  	res.send(data);
  }
  });

});

//16
//get buyer profile page with id
app.get('/tobuyer/:id' , function(req,res){

    var query = {transporter_id:Number(req.params.id)};
    //find buyer in transporter database
  	TransOrder.find(query,function(err,data){
  	if(err) console.log(err);
  	if(data.length>0){
  		console.log(data);
  	res.send(data);
  	}
 	});
});

//17
//generate private and public keys-store public key in database of transporter ans private in cache
app.get('/generateKeys/:tid' , function(req,res){
	
	var key = ec.genKeyPair();//private
	var pubPoint = key.getPublic();
	var pub = pubPoint.encode('hex');
	// var key2 = ec.keyFromPublic(pub, 'hex');//public

	cache.put('key', key);

	var tid = Number(req.params.tid);
	// var oid = Number(req.params.oid);
	var keys = {key:pub};
	TransOrder.updateOne(transporter_id:tid,{pubKey:keys},function(err){
		if(err) console.log('error');
		console.log('public key stored');
		// TransOrder.find(transporter_id:tid,function(err,data){
		// 	if(err) throw err;
		// 	console.log(data);
		// });
	});
});

//18
//seller request to access next person in chain
app.get('/next/:id/:no' , function(req,res){
    
    console.log('called');
    var lastT = 'no';
    console.log(lastT);
	var query = {order_id : req.params.id};
	console.log(query);
	var no = req.params.no;
	console.log(no);
	var order_id  = req.params.id;
	Order.find(query , function(err,data){
		if(err) throw err;
		if(data.length >0){
         var array = data[0].transporter_details;
         console.log(array);
         for(var j=0 ; j<array.length-2 ; j++){
            if(array[j] == no){
            	break;}}
            	var transNext = j+1;
            	if(transNext == (array.length)-1){
            		console.log('last transporter' + transNext);
            		console.log('came to last second');
            		lastT = 'yes';
            	} else {
            		lastT = 'no';
            	}
            	console.log(array[transNext]);
            	var query1 = {transporter_id : Number(array[transNext])};
            	TransOrder.updateOne({order_id:order_id,transporter_id:Number(array[transNext])},{flag:true},function(err){
            		if(err) throw err;
            		console.log('flag made true');
            	    console.log(lastT);
            	    if(lastT=='no')
            			res.send(['no']);
            	    else
            	        res.send(['yes'])
            	});
            	// transporter.updateOne({order:order_id},{flag:true},function(err){
            	// 	if(err) throw err;
            	// 	console.log('flag made true');
            	// });
            	// transporter.updateOne(query1, { $set:{'orders.flag' : true}},function(err){
            	// 	if(err) throw err;
            	// 	console.log('done');
            	// 	transporter.find(query1,function(err,data){
            	// 		if(err) throw err;
            	// 		console.log(data);
            	// 		res.send({access : lastT});
            	// 	})
            	// 		}); 
            }
		});
});

//19
//check transporter's hash to see whether he/she is the correct next owner of product or not
app.get('/checkTrans/:tid/:id/:flag' , function(req,res){
    console.log(req.params.id , req.params.flag)
    var iiid = Number(req.params.id);

    if(req.params.flag === 'true'){

	// var array = forP(iiid);
	// console.log(array[0]);
	// console.log(array[1]);
	// console.log(array[2]);
	// console.log(array[3]);
	// console.log(array[4]);
	// var transHash = array[3];
 //    var f = '"' + transHash + '"';
 //    console.log(f);
 //    hash.update(f);
 //    var  convertedTransHash = hash.digest('hex');
 //    console.log('correct');
 //    console.log(convertedTransHash);
 //    var ch = [];
 //    ch.push(convertedTransHash);
    var order_id = req.params.id;
    TransOrder.updateOne({order_id:order_id,transporter_id:req.params.tid},{flag:false},function(err){
            		if(err) throw err;
            		console.log('flag made false');
            	});
	// Transporter.updateOne({order:order._id},{flag:false},function(err){
	// 	if(err) throw err;
	// 	console.log('flag updated');
	// });
  
    //var q = {transporter_id :Number(req.params.tid)};
    //make the transporter flag again false making her/him once chain moved forward

    // transporter.updateOne(q , {$set : {'orders.flag' : false}},function(err){
    // 	if(err) throw err;
    // 	console.log('done');
    // 	transporter.find(q,function(err,data){
    // 		if(err) throw err;
    // 		console.log(data);
    // 	})
    // })
    } else {
    	console.log('not correct')
    }
});

//20
//transporter is being approved to be the next owner
app.get('/approved/:id' , function(req,res){

	var query = {transporter_id : Number(req.params.id)};
	var order_id = req.params.id;
	Transporter.updateOne({order:order._id},{pubKey:key2},function(err){
		if(err) throw err;
		console.log('public key stored');
	});
	transporter.updateOne(query , {$set:{'orders.approved': true}} ,function(err){
		if(err) throw err;
	});
});

//21
//performing digital signature
var idd=0;
app.get('/sign/:tid/:cid/:oid/:forlast' , function(req,res){
	if(req.params.forlast == 'yes'){
		console.log('buyer will sign first');
		// var array = {string:'',idd:0,cid:0};
		// res.send(array)
	}
	else{
	console.log('signature');
	var query1 = {order_id : Number(req.params.oid)};
	OrderCrypto.find(query1,function(err,data){
		if(err) throw err;
		 idd = Number(data[0].getid);
		return idd;
	}).then(idd => {
		console.log(idd);

		TransOrder.updateOne({transporter_id:Number(req.params.tid),order_id:Number(req.params.oid)},
							  {flag:'completed'},function(err){
							 	if(err) throw err;
							 });
		// var query = {transporter_id : Number(req.params.tid)};
		// transporter.find(query , function(err,data){
		// if(err) throw err;
		// var key2 = data[0].orders.pubKey;
		// console.log(key2);
		// if(data[0].orders.approved){
		var msgoid = (req.params.oid).toString(16);
		var msgHash = msgoid;
		var key = cache.get('key');
		var signature = key.sign(msgHash);
		var derSign = signature.toDER();
		//console.log(key2.verify(msgHash, derSign));
		TransOrder.find({transporter_id:Number(req.params.tid),order_id:Number(req.params.oid)},function(err,data){
			if(err) throw err;
			var pub = data[0].pubKey.key;
			var key2 = ec.keyFromPublic(pub, 'hex');
			var ans = key2.verify(msgHash, derSign);
			console.log('answer' + ans);
			return ans;
		}).then(answer => {
			 TransOrder.updateOne({transporter_id:Number(req.params.tid),order_id:Number(req.params.oid)},
								  {verify:true},function(err){
								  	if(err) throw err;
								  });
		});
		var ans = Number(idd[0].getid);
		var cd = Number(req.params.cid);
		if(idd!=0){
		var array = {string : derSign, idd : ans , cid : cd};
		res.send(array);
		}
	    // } else {
	    // 	console.log('This transporter is not verified');
	    // }
    //});
});
 }
});

//22
//received transaction hash after signature stored on blockchain
app.get('/returnSign/:tx/:oid/:cid/:tid' , function(req,res){

	var query = {transporter_id : req.params.tid , order_id : req.params.oid};

	TransOrder.updateOne(query , {tx : req.params.tx} , function(err){
		if(err) throw err;
		console.log('tx after sign updated');
	});
});


//23
//Four Public API
var mainarray = [];
 
//(details of order with the complete chain showing all nodes)
app.get('/api/:order_id',function(req,res){
	console.log('came inside api');
	var oid =  Number(req.params.order_id);
	var query = {order_id : oid};
	//var i =1;
	TransOrder.find(query)
		.then(data => {
			// var seller = data[0].seller_detail;
			// var buyer = data[0].buyer_detail;
			// var array = data[0].transporter_details;
			// console.log('repeat2 called');
			// repeat2(array, i , oid , mainarray , seller , buyer);
			res.send(data);
		})
		
});


app.get('/verifytrans/:oid/:tid' , function(req,res){
	var query = {transporter_id:Number(req.params.tid)};
	TransOrder.find({transporter_id:Number(req.params.tid),order_id:Number(req.params.oid)})
	.then(data => {
		console.log('Verified : ' + data[0].verify);
		transporter.find(query,function(err,data){
		if(err) throw err;
		console.log(data)
		// console.log(`Details - 
		// 			 Transporter Name :  `)
	});

	});
});

//function to find all transporters of the chain
// var ary6 = [];var ordid2 = 0;var amt = 0;var s2 = '' ; var b2 = '';
// function notifyAll2(ary6 , amt , ordid2 , s2 , b2){
// 	var check = false;
// 	var tid = Number(ary6[Number(amt)]);
// 	var oid = Number(ordid2);
// 	var query = {transporter_id : tid};
// 	transporter.find(query)
// 		.then(data => {
// 			console.log(data[0].orders)
// 			if(data[0].orders.tx)
// 				var check = true;
// 			var result = {name : data[0].transporter_name , tx : check };
// 			mainarray.push(result);
// 			return mainarray;
// 	})
// 		.then(mainarray => {
// 			repeat2(ary6,amt+1,ordid2 , mainarray , s2 , b2)
// 		});
// }

// //function to loop over all nodes till the end of the chain
// var amount2 = 0;var ary5=[];var orid2 = 0;var s = '' ; var b = '';
// function repeat2(ary5,amount2,orid2,mainarray , s , b){
// 	if(amount2>ary5.length-2){
// 		console.log('D!!');
// 		return;
// 	}
// 	return notifyAll2(ary5,amount2,orid2 , s , b);
// }

app.get('/api1/:company' , function(req,res){

})

//api-2(Find out total number of orders between a period of time)
app.get('/api2/:date1/:date2' , function(req,res){

	var date1 = (req.params.date1).toISOString();
	var date2 = (req.params.date2).toISOString();

	Order.find({created_at: {$gte: ISODate(date1),$lt: ISODate(date2)}} , function(err,data){
		if(err) throw err;
		if(data.length>0){
			console.log(data[0]);
			res.send(data[0]);
		}
	});
});

//api-3(find out total number of orders bought from a place)
app.get('/api3/place' , function(req,res){
	console.log('entered api3');
	Order.aggregate([
	{ $group : 
	{_id : '$buyer_detail' , total_orders : { $sum : 1 } }
	}]).exec(
	function(err,res) {
	if(err) throw err;
	console.log(res);
	});
});

//api-4(find out total number of orders for a particular category of product)
app.get('/api4/product' , function(req,res){
	console.log('entered api4');
	Order.aggregate([
	{ $group : 
	{_id : '$product_details' , total_orders : { $sum : 1 } }
	}]).exec(
	function(err,res) {
	if(err) throw err;
	console.log(res);
	});
});


//find order details with order_id
// app.get('/order_details/:id', urlencodedParser , (req , res) => {
// 		const {seller_detail , buyer_detail , product_details , name , from_place , to_place , 
//  			   obtain_from , give_to} = req.body;
//  		const query = {_id:req.params.id};
//  		Order.find(query,function(err,order){
//  			if(err) throw err;
//  			if(order.length ==0){
//  				console.log('No such order exists');
//  				res.send('No such order exists');
//  			}
//  			if(order.length >0){
//  				res.send(order[0]);
//  			}
//  		});
// });

app.listen('8080');

//tansporter notify about time also
//transporter order field
//seller and buyer cities me alg transporters of diff id0
//keys store
//scan order_id
//buyer before last transporter sign
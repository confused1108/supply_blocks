const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const nodemailer = require('nodemailer');
const {SHA3} = require('sha3');

const hash = new SHA3(512);

const app = express();

app.set('view engine' , 'ejs');

app.use(express.static('./public'));

mongoose.connect('mongodb://localhost/order_chain');

var db = mongoose.connection;

const PackageSchema = new mongoose.Schema({
	packagetype:{type : String , required : true},
	cid :{type : String , required : true},
	email : {type : String , required : true},
	bookdate : {type : String , required : true},
	total : {type : Number , required : true},
	no : {type : Number , required : true}
});

const CompanySchema = new mongoose.Schema({
	cname : {type : String , required : true},
	website : {type : String , required : true},
	email : {type : String , required : true},
	number : {type : Number , required : true},
	password : {type : String , required : true}
});

const IndSchema = new mongoose.Schema({
	firstname : {type : String , required : true},
	lastname : {type : String , required : true},
	email : {type : String , required : true},
	number : {type : Number , required : true},
	password : {type : String , required : true}
});

const transporterSchema = new mongoose.Schema({
	transporter_name : {type : String , required : true},
	transporter_id : {type : Number , required : true},
	city_id : {type : Number , required : true},
	number : {type : Number , required : true},
	msgs : {type : Array , required : true}
});

const CitiesSchema = new mongoose.Schema({
	city_name : {type : String , required : true},
	city_id : {type : String , required : true}
});

const OrderSchema = new mongoose.Schema({
	order_id : {type : Number , required : true},
	seller_detail : {type : String , required : true},
	buyer_detail : {type : String , required : true},
	//product_details : {type : Object , required : true},
	pvalue : {type : Number , required : true},
	gvalue : {type : Number , required : true},
	hashvalue: {type : Number , required : true},
	convertedHash : String,
    transporter_details : Array 
});

const NodeSchema = new mongoose.Schema({
	name : {type : String , required : true},
	number : {type : Number , required : true},
	obtain_from : {type : String , required : true},
	give_to : {type : String , required : true}
});

const connections_finalSchema = new mongoose.Schema({
	Conn_id:Number,
	Source:Number,
	Destination:Number,
	Distance:Number,
	time_const:Number,
	cost_constant:Number
});

const GraphNodesSchema = new mongoose.Schema({
	nodes : Array 
});

CompanySchema.plugin(timestamp);
IndSchema.plugin(timestamp);
PackageSchema.plugin(timestamp);
transporterSchema.plugin(timestamp);
OrderSchema.plugin(timestamp);
NodeSchema.plugin(timestamp);

const Node = mongoose.model('Node', NodeSchema , 'Node');
const GraphNodes = mongoose.model('GraphNodes', GraphNodesSchema , 'GraphNodes');
const Order = mongoose.model('Order', OrderSchema , 'Order');
const Company = mongoose.model('Company', CompanySchema , 'Company');
const Ind = mongoose.model('Ind', IndSchema , 'Ind');
const Package = mongoose.model('Package', PackageSchema , 'Package');
const transporter = mongoose.model('transporter', transporterSchema , 'transporter');
const connections_final = mongoose.model('connections_final', connections_finalSchema , 'connections_final');
const Cities= mongoose.model('Cities', CitiesSchema , 'Cities');

var Graph = require('node-dijkstra');
var route = new Graph();
var i=1;

//Company registration
app.post('/user/:cname/:website/:email/:number/:password',function(req,res){
	const {cname , website , email , number , password} = req.params ;  
	const company = Company({cname , website , email , number , password}).save(err => console.log(err));
});

//Individual user registration
app.post('/induser/:firstname/:lastname/:email/:number/:password',function(req,res){
    
	const {firstname , lastname , email , number , password} = req.params ;  
	const ind = Ind({firstname , lastname , email , number , password}).save(err => console.log(err));
});

//Company login
app.get('/searchuser/:email/:password',function(req,res){
   
	const {email , password} = req.params ; 
	console.log(email);
	const query = {email : email , password  : password} ;
	Company.find(query , function(err , user){
		if(err) throw err;
		res.send(user[0]);
	});
});

//Individual user login
app.post('/searchinduser/:email/:password',function(req,res){

	const {email , password} = req.params ; 
	const query = {email : email , password  : password} ;
	Ind.find(query , function(err , user){
		if(err) throw err;
		res.send(user);
	});
});

//Package addition by a company
app.post('/addpackage/:email/:bookdate/:no/:days/:packagetype/:cid',function(req,res){

	const {email , bookdate , no ,days , packagetype , cid} = req.params;
	const package = Package({email:email , bookdate : bookdate , total : days , no : no ,
		packagetype : packagetype ,cid:cid}).save(function(err){
		if(err) throw err;
	});
	res.send('done');

});

//find order details with order_id
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

// get transportr profile with id
app.get('/transporter/:id' , function(req,res){
  
    const query = {transporter_id:Number(req.params.id)};
    transporter.find(query, function(err,node){
  	if(err) throw err;
  	res.send(node[0]);
  });
});

//reducing the total number after use of api
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

var arr =[];
//generate Graph
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
						 string += data[j].Destination + ':' + data[j].Distance + ',';
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

var node1 = 0 , node2 = 0;

app.get('/gethash/:id' , function(req,res){
	console.log('stage1');
	const query = {order_id : req.params.id};
	Order.find(query , function(err,data){
		if(err) throw err;
		if(data.length > 0){
			res.send(data[0]);
		}
	})
});

var finalarray =[];
app.get('/placeorder' , urlencodedParser , function(req,res){
	
	const {seller_detail , buyer_detail , /*product_details*/} = req.body;
	var store = (new Date()).getTime();
    var values = forP(store);
    const order_id = values[0];
    const pvalue = values[1];
    const gvalue = values[2];
    const hashvalue = values[3];
    var f = '"' + hashvalue + '"';
    hash.update(f);
    var  convertedHash = hash.digest('hex');
    console.log(convertedHash);
	const query1 = {city_name : seller_detail};
	const query2 = {city_name : buyer_detail};
	Cities.find(query1,function(err,data){
		if(err) throw err;
		if(data.length > 0){
				node1 = data[0].city_id;
				Cities.find(query2,function(err,data){
					if(err) throw err;
					if(data.length > 0){
						node2 = data[0].city_id;
						GraphNodes.find({},function(err,data){
							if(err) throw err;
							if(data.length>0){
								array1 = data[0];
								eval(array1);
								finalarray = route.path(node1,node2);
								var order = Order({convertedHash , order_id  , seller_detail , buyer_detail , pvalue , gvalue,
													hashvalue , transporter_details : finalarray}).save(function(err){
												 	if(err) throw err;
												});
								console.log('Order saved');
		                        sendNotification(finalarray);
	
						} });
				    } });
		} });});

var trans_arr =[];

function sendNotification(trans_arr){

    console.log(trans_arr);
	for(var i =1 ; i < trans_arr.length-1 ; i++){
		var x = Number(trans_arr[i]);
		var y = Number(trans_arr[i-1]);
		var z = Number(trans_arr[i+1]);
		const query = {transporter_id : x};
		const query1 = {transporter_id : y };
		const query2 = {transporter_id : z };
		console.log(query);console.log(query1);console.log(query2);
                transporter.find(query1,function(err,data){
                	if(err) throw err;
                	if(data.length>0){
                		var obtain_from = data[0].transporter_name;
                		console.log(obtain_from);
                		transporter.find(query2,function(err,data){
                			if(err) throw err;
                			if(data.length>0){
                				var give_to = data[0].transporter_name;
                				console.log(give_to);
                				var msg = 'Obtain from ' + obtain_from + ' and Give to ' + give_to ;
 							    transporter.update(query, {$push:{msgs:msg}} ,function(err){
									if(err) throw err;	

                			}); }

                }); } });	console.log('updated');	 }
}

var hsh ='';
function hashToReact(hsh){

}

// checking the 4 conditions
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
			const query2= {cid:user[0]._id};
			Package.find(query2,function(err,usr){
				console.log('stage2');
				if(err) throw err;
				if(usr.length == 0 ){
					console.log('No Package Exists');//if the company has no package present
					res.send('No Package Exists');
				}
				if(usr.length > 0){
	 				const query3 = {_id : pid};
					Package.find(query3,function(err,package){
						if(err) throw err;
						if(package.length ==0){
							console.log('No such package for this id exists');
							//if company has packages but no package of that id exists
							res.send('No such package for this id exists');
						}
						if(package.length>0){
						for(let k = 0; k < package.length ; k++){

							    const date = (new Date()).getTime();
								const checkdate = (new Date(package[k].bookdate)).getTime();
								const diff = Math.floor((Math.abs(Number(date) - Number(checkdate)))/86400000);
								if(package[k].no==0){
									console.log('All used for package type' + package[k].packagetype);
									//if number of apis availbale for that package is 0
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
									//if all 4 conditions are not there
									console.log('Success');
									dat[m] = package[k];
									m++;
								}
						}
						console.log(errors);console.log(dat);
						res.send(dat);
						
				}});
			}
});}

}); });

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
    var a = Math.floor(Math.random()*20 + 5);
    var hash = calculateHash(result,ans,a); //gives hash
    array.push(val);
    array.push(ans);
    array.push(result);
    array.push(hash);
    return array;

}



app.listen('8080');

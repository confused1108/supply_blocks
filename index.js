const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
var nodemailer = require('nodemailer');

const app = express();

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

const TransportersSchema = new mongoose.Schema({
	name : {type : String , required : true},
	from_place : {type : String , required : true},
	to_place : {type : String , required : true},
	obtain_from : {type : String , required : true},
	give_to : {type : String , required : true}
});

const OrderSchema = new mongoose.Schema({
	order_id : {type : Number , required : true},
	seller_detail : {type : String , required : true},
	buyer_detail : {type : String , required : true},
	product_details : {type : Object , required : true},
    transporter_details : TransportersSchema
});

const NodeSchema = new mongoose.Schema({
	name : {type : String , required : true},
	number : {type : Number , required : true},
	email : {type : String , required : true}
});


CompanySchema.plugin(timestamp);
IndSchema.plugin(timestamp);
PackageSchema.plugin(timestamp);
TransportersSchema.plugin(timestamp);
OrderSchema.plugin(timestamp);
NodeSchema.plugin(timestamp);

const Node = mongoose.model('Node', NodeSchema , 'Node');
const Order = mongoose.model('Order', OrderSchema , 'Order');
const Company = mongoose.model('Company', CompanySchema , 'Company');
const Ind = mongoose.model('Ind', IndSchema , 'Ind');
const Package = mongoose.model('Package', PackageSchema , 'Package');

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

//search for tranporters in order and form transporter database
app.get('/transporter' , (req,res) => {
        Order.find({},function(err,data){
			if(err) throw err;
			// if no order is places till now
			if(data.length ==0){
				console.log('No order exists');
			}
			//if orders are there then enter their transporter details in database
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


// get transportr profile with id
app.get('/transporter/:id' , function(req,res){
  
    const query = {tid:req.params.id};
    Node.find(query, function(err,node){
  	if(err) throw err;
  	res.render('transporterPage',{data:node});
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

// checking the 4 conditions
app.post('/check/:id',urlencodedParser,function(req,res){

	const pid = req.body.pid;
	const {seller_detail , buyer_detail , product_details , name , from_place , to_place , 
 			   obtain_from , give_to} = req.body;
    const order_id = (new Date()).getTime();
    forP(order_id);
	const order = Order({order_id , seller_detail , buyer_detail , product_details , transporter_details :{name , from_place , to_place , 
							 obtain_from , give_to}}).save(err => console.log(err));
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

var val = 0;
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
 
    var answer = toBinary(Number(val));
    var prime = count(answer);
    var ans = isPrime(prime);//gives P
    var result = findPrimitive(ans);//gives G
    console.log(ans);
    console.log(result);

}



app.listen('8080');

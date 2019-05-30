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

CompanySchema.plugin(timestamp);
IndSchema.plugin(timestamp);
PackageSchema.plugin(timestamp);

const Company = mongoose.model('Company', CompanySchema , 'Company');
const Ind = mongoose.model('Ind', IndSchema , 'Ind');
const Package = mongoose.model('Package', PackageSchema , 'Package');

app.post('/user/:cname/:website/:email/:number/:password',function(req,res){
	const {cname , website , email , number , password} = req.params ;  
	const company = Company({cname , website , email , number , password}).save(err => console.log(err));
});

app.post('/induser/:firstname/:lastname/:email/:number/:password',function(req,res){
    
	const {firstname , lastname , email , number , password} = req.params ;  
	const ind = Ind({firstname , lastname , email , number , password}).save(err => console.log(err));
});

app.get('/searchuser/:email/:password',function(req,res){
   
	const {email , password} = req.params ; 
	console.log(email);
	const query = {email : email , password  : password} ;
	Company.find(query , function(err , user){
		if(err) throw err;
		res.send(user[0]);
	});
});

app.post('/searchinduser/:email/:password',function(req,res){

	const {email , password} = req.params ; 
	const query = {email : email , password  : password} ;
	Ind.find(query , function(err , user){
		if(err) throw err;
		res.send(user);
	});
});

app.post('/addpackage/:email/:bookdate/:no/:days/:packagetype/:cid',function(req,res){

	const {email , bookdate , no ,days , packagetype , cid} = req.params;
	const package = Package({email:email , bookdate : bookdate , total : days , no : no ,
		packagetype : packagetype ,cid:cid}).save(function(err){
		if(err) throw err;
	});
	res.send('done');

});

app.get('/package/:id',function(req,res){
	console.log('hey');
	console.log(req.params.id);
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

app.post('/check/:id',urlencodedParser,function(req,res){

	const pid = req.body.pid;
	var i=0,m=0;var errors = [],dat=[],array=[];
    console.log('stage0');
	const query = {_id : req.params.id};
	Company.find(query,function(err,user){
		console.log(req.params.id);
		console.log('stage1');
		if(err) throw err;
		if(user.length == 0){
			console.log('No such user exists');
			res.send('No such user exists');
		}
		if(user.length>0){
			const query2= {cid:user[0]._id};
			Package.find(query2,function(err,usr){
				console.log('stage2');
				if(err) throw err;
				if(usr.length == 0 ){
					console.log('No Package Exists');
					res.send('No Package Exists');
				}
				if(usr.length > 0){
	 				const query3 = {_id : pid};
					Package.find(query3,function(err,package){
						if(err) throw err;
						if(package.length ==0){
							console.log('No such package for this id exists');
							res.send('No such package for this id exists');
						}
						if(package.length>0){
					    console.log('stage3');
						for(let k = 0; k < package.length ; k++){

							    const date = (new Date()).getTime();
								const checkdate = (new Date(package[k].bookdate)).getTime();
								const diff = Math.floor((Math.abs(Number(date) - Number(checkdate)))/86400000);
								if(package[k].no==0){
									console.log('All used for package type' + package[k].packagetype);
									errors[i]='All used for package type' + package[k].packagetype;
									i++;
								}
								else if(diff >=  package[k].total){
									console.log('Date of use expired for package type'  + package[k].packagetype);
									errors[i] = 'Date of use expired for package type'  + package[k].packagetype;
									i++;
									
								}
								else {
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


app.listen('8080');

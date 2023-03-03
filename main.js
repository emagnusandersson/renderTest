


global.app=global;
import http from "http";
import https from 'https';
import fs, {promises as fsPromises} from "fs";
import * as dotenv from 'dotenv'
dotenv.config();

await import('./lib.js');

import Redis from "ioredis";
//const Redis = require("ioredis");

const { REDIS_URL } = process.env;
console.log("process.env.REDIS_URL: "+REDIS_URL);
// Internal Redis URL example:
// "redis://red-xxxxxxxxxxxxxxxxxxxx:6379"
// External Redis URL will be slightly different:
// "rediss://red-xxxxxxxxxxxxxxxxxxxx:PASSWORD@HOST:6379"


var strInfrastructure=process.env.strInfrastructure||'local';

const renderRedis = new Redis(REDIS_URL);

renderRedis.set("animal", "cat");

var [err, result]=await renderRedis.get("animal").toNBP()
console.log(result); // Prints "cat"



var boUseSelfSignedCert=false
//var port=argv.p||argv.port||5000;
var port=process.env.PORT||5000;

var handler=function(req, res) {
  res.writeHead(200);
  res.end('hello world\n');
}

var [err, result]= await fsPromises.stat('0SelfSignedCert').toNBP();
if(err) {
  if(err.code='ENOENT') ;
  else {console.error(err); process.exit(-1);}
}else boUseSelfSignedCert=true;

if(boUseSelfSignedCert){
  //const options = { key: fs.readFileSync('0SelfSignedCert/server.key'), cert: fs.readFileSync('0SelfSignedCert/server.cert') };

  var [err, buf]=await fsPromises.readFile('0SelfSignedCert/server.key').toNBP(); if(err) {console.error(err); process.exit(-1);}
  var key=buf.toString();
  var [err, buf]=await fsPromises.readFile('0SelfSignedCert/server.cert').toNBP(); if(err) {console.error(err); process.exit(-1);}
  var cert=buf.toString();
  const options= {key, cert};
  https.createServer(options, handler).listen(port);   console.log("Listening to HTTPS requests at port " + port);
} else{
  http.createServer(handler).listen(port);   console.log("Listening to HTTP requests at port pp " + port);
}

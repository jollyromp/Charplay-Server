// Setup dependencies

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import schema from './schema';

import { graphql, printSchema } from 'graphql';
import graphqlExpress from 'express-graphql';

import Message from './mongoose/message';

// start the server

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.listen(8000,()=> {console.log("+++Express Server is Running!!!")});
app.get('/',(req,res)=>{
 res.sendFile(__dirname + '/index.html')
});

// Mongoose Connection

var uri = 'mongodb://localhost:27017/rpc';
mongoose.Promise = global.Promise;
mongoose.connect(uri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')});

db.once('open', () => {
 console.log( '+++Connected to mongoose');
});

// CORS and different allowed methods

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

// GraphQL Endpoint

app.get('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  graphiql: true
}));

app.post('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

app.use('/schema', (req, res) => {
  res.type('text/plain').send(printSchema(schema));
});

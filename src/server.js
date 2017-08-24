// Setup dependencies

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import schema from './schema';

import {graphql} from 'graphql'
import graphqlExpress from 'express-graphql';

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

// GraphQL Endpoint

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  graphiql: true
}));

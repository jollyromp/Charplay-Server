// Setup dependencies

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import schema from './schema';

import { graphql, printSchema } from 'graphql';
import graphqlExpress from 'express-graphql';

import Message from './mongoose/message';

import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

// start the server

const PORT = 8000;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

// PubSub

const ws = createServer(app);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
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

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  graphiql: true
}));

app.use('/schema', (req, res) => {
  res.type('text/plain').send(printSchema(schema));
});

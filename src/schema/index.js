import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql/type';

import userQuery from './query/userQuery';
import characterQuery from './query/characterQuery';
import roomQuery from './query/roomQuery';
import messageQuery from './query/messageQuery';

import addMessageMutation from './mutation/addMessageMutation';

import messageAddedSubscription from './subscription/messageAddedSubscription';

var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: userQuery,
      character: characterQuery,
      room: roomQuery,
      message: messageQuery
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      message: addMessageMutation
    }
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      messageAdded: messageAddedSubscription
    }
  })
});

export default Schema;

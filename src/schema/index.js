import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql/type';

import { userField } from './field/user';
import { characterField } from './field/character';
import { roomField } from './field/room';
import { messageField } from './field/message';

var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: userField,
      character: characterField,
      room: roomField,
      message: messageField
    }
  })
});

export default Schema;

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import userType from './userType';
import characterType from './characterType';
import roomType from './roomType';

var messageType = new GraphQLObjectType({
  name: 'message',
  description: 'Room item',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id of the message.',
    },
    _author: {
      type: userType,
      description: 'The id of the message author.',
    },
    _character: {
      type: characterType,
      description: 'The id of the message character.',
    },
    _room: {
      type: roomType,
      description: 'The id of the message room',
    },
    content: {
      type: GraphQLString,
      description: 'Content of the message.',
    }
  })
});

export default messageType;

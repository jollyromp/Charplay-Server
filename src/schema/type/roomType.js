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

var roomType = new GraphQLObjectType({
  name: 'room',
  description: 'Room item',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id of the character.',
    },
    url: {
      type: GraphQLString,
      description: 'URL identifier for the room.',
    },
    name: {
      type: GraphQLString,
      description: 'Name of the room',
    },
    description: {
      type: GraphQLString,
      description: 'Description of the room',
    },
    _owners: {
      type: new GraphQLList(userType),
      description: 'Owner IDs',
    }
  })
});

export default roomType;

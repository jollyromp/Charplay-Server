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

var characterType = new GraphQLObjectType({
  name: 'character',
  description: 'Character item',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id of the character.',
    },
    _author: {
      type: userType,
      description: 'user that owns the character.',
    },
    name: {
      type: GraphQLString,
      description: 'Name of the character.',
    },
    color: {
      type: GraphQLString,
      description: 'Color Accent of the character.',
    },
    avatar: {
      type: GraphQLString,
      description: 'URL of the avatar picture.',
    },
    gallery: {
      type: new GraphQLList(GraphQLString),
      description: 'Gallery images for the character.',
    }
  })
});

export default characterType;

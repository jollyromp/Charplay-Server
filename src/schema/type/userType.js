import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

var userType = new GraphQLObjectType({
  name: 'user',
  description: 'User item',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id of the user.',
    },
    tag: {
      type: GraphQLString,
      description: 'The discriminating tag of the user.',
    },
    username: {
      type: GraphQLString,
      description: 'The username of the user.',
    },
    password: {
      type: GraphQLString,
      description: 'The user\'s hashed password',
      resolve() {
        return null;
      }
    }
  })
});

export default userType;

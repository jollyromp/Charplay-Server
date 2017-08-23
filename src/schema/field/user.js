import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import User from '../../mongoose/user';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

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

var userField = {
  type: new GraphQLList(userType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, {_id}, source, fieldASTs) => {
    var projections = getProjection(fieldASTs);
    var foundItems = new Promise((resolve, reject) => {
        User.find({_id}, projections,(err, data) => {
            err ? reject(err) : resolve(data)
        })
    })

    return foundItems
  }
}

export { userField, userType };

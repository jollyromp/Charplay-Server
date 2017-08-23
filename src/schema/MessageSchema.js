import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import Message from '../mongoose/message';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var messageType = new GraphQLObjectType({
  name: 'message',
  description: 'Room item',
  fields: () => ({
    _id: {
      type: (GraphQLString),
      description: 'The id of the message.',
    },
    _author: {
      type: (GraphQLString),
      description: 'The id of the message author.',
    },
    _character: {
      type: (GraphQLString),
      description: 'The id of the message character.',
    },
    _room: {
      type: (GraphQLString),
      description: 'The id of the message room',
    },
    content: {
      type: (GraphQLString),
      description: 'Content of the message.',
    }
  })
});

var MessageSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: new GraphQLList(messageType),
        args: {
          _id: {
            name: '_id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (root, {_id}, source, fieldASTs) => {
          var projections = getProjection(fieldASTs);
          var foundItems = new Promise((resolve, reject) => {
              Message.find({_id}, projections,(err, data) => {
                  err ? reject(err) : resolve(data)
              })
          })

          return foundItems
        }
      }
    }
  })
});

export default MessageSchema;

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import Message from '../../mongoose/message';

import { userType } from './user';
import { characterType } from './character';
import { roomType } from './room';

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

var messageField = {
  type: new GraphQLList(messageType),
  args: {
    _room: {
      name: '_room',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, {_room}, source, fieldASTs) => {
    var projections = getProjection(fieldASTs);
    var foundItems = new Promise((resolve, reject) => {
      Message.find({_room}, projections, (err, data) => {
        err ? reject(err) : resolve(data)
      }).populate('_author _character _room')
    })

    return foundItems
  }
}

export { messageField, messageType };

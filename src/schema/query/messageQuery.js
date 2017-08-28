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
import messageType from '../type/messageType';
import userType from '../type/userType';
import characterType from '../type/characterType';
import roomType from '../type/roomType';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var messageQuery = {
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

export default messageQuery;

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import Room from '../../mongoose/room';
import roomType from '../type/roomType';
import userType from '../type/userType';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var roomQuery = {
  type: new GraphQLList(roomType),
  args: {
    _id: {
      name: '_id',
      type: GraphQLString
    },
    url: {
      name: 'url',
      type: GraphQLString
    }
  },
  resolve: (root, {_id, url}, source, fieldASTs) => {
    let args = {
      ..._id && {_id},
      ...url && {url}
    }
    var projections = getProjection(fieldASTs);
    var foundItems = new Promise((resolve, reject) => {
      Room.find(args).select(projections).populate('_owners').exec((err, data) => {
        err ? reject(err) : resolve(data)
      })
    })

    return foundItems
  }
}

export default roomQuery;

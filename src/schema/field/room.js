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

import { userType } from './user';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

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

var roomField = {
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

export { roomField, roomType };

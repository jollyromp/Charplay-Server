import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import Character from '../../mongoose/character';
import characterType from '../type/characterType';
import userType from '../type/userType';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var characterQuery = {
  type: new GraphQLList(characterType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, {_id}, source, fieldASTs) => {
    var projections = getProjection(fieldASTs);
    var foundItems = new Promise((resolve, reject) => {
        Character.find({_id}, projections,(err, data) => {
            err ? reject(err) : resolve(data)
        }).populate('_author')
    })

    return foundItems
  }
}

export default characterQuery;

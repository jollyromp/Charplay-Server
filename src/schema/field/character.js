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

import { userType } from './user';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

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

var characterField = {
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

export { characterField, characterType };

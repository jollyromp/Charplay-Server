import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import Character from '../mongoose/character';

export function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var CharacterType = new GraphQLObjectType({
  name: 'character',
  description: 'Character item',
  fields: () => ({
    _id: {
      type: (GraphQLString),
      description: 'The id of the character.',
    },
    _author: {
      type: (GraphQLString),
      description: 'ID of user that owns the character.',
    },
    name: {
      type: (GraphQLString),
      description: 'Name of the character.',
    },
    color: {
      type: (GraphQLString),
      description: 'Color Accent of the character.',
    },
    avatar: {
      type: (GraphQLString),
      description: 'URL of the avatar picture.',
    },
    gallery: {
      type: (GraphQLList),
      description: 'Gallery images for the character.',
    }
  })
});

var characterSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
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
              })
          })

          return foundItems
        }
      }
    }
  })
});

export default CharacterSchema;

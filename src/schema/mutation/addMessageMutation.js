import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql/type';

import messageType from '../type/messageType';
import Message from '../../mongoose/message';

var addMessageMutation = {  
  type: messageType,
  description: 'Send a message',
  args: {
    content: {
      name: 'Message Content',
      type: new GraphQLNonNull(GraphQLString)
    },
    _character: {
      name: 'Message character',
      type: new GraphQLNonNull(GraphQLString)
    },
    _room: {
      name: 'Message room',
      type: new GraphQLNonNull(GraphQLString)
    },
    _author: {
      name: 'Message author',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    var newMessage = new Message(args);
    return new Promise((resolve, reject) => {
      newMessage.save(function (err) {
        if (err) reject(err)
        else resolve(newMessage)
      })
    })
  }
}

export default addMessageMutation;

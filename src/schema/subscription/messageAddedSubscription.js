import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql/type';
import { withFilter } from 'graphql-subscriptions';

import messageType from '../type/messageType';
import pubsub from './pubsub';

const messageAddedSubscription = {
  type: messageType,
  args: {
    _room: {
      name: 'Message room',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: withFilter(
    () => pubsub.asyncIterator('messageAdded'),
    (payload, variables) => {
      console.log(variables);
      return payload.messageAdded._room === variables._room;
    }
  ),
}

export default messageAddedSubscription

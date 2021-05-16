import { parseISO, format, isAfter } from 'date-fns';
import * as types from './types';

export default {
  [types.MESSAGES_GET](state) {
    return state.messages.map((message) => ({
      ...message,
      createdFormatted: format(parseISO(message.created), 'dd.MM.yyyy HH:mm:ss'),
    }));
  },
  [types.MESSAGES_SENDING_FILTRED_GET](state) {
    return state.messagesSending.filter((message) => message.room === state.currentRoom);
  },
  [types.ROOMS_SORTED_GET](state) {
    return [...state.rooms]
      .sort((a, b) => (isAfter(parseISO(a.last_message.created), parseISO(b.last_message.created)) ? -1 : 1))
      .map((room) => ({
        ...room,
        last_message: {
          ...room.last_message,
          createdFormatted: format(parseISO(room.last_message.created), 'dd.MM.yyyy HH:mm:ss'),
        },
      }));
  },
};

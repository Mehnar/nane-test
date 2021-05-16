import * as types from './types';

export default {
  [types.LOGIN_SET](state, payload) {
    state.login = payload;
  },
  [types.ROOMS_SET](state, payload) {
    state.rooms = payload;
  },
  [types.SOCKET_SET](state, payload) {
    state.socket = payload;
  },
  [types.SOCKET_ERROR_SET](state, payload) {
    state.isSocketError = payload;
  },
  [types.ROOMS_IS_LOADING_SET](state, payload) {
    state.isRoomsLoading = payload;
  },
  [types.ROOM_CURRENT_SET](state, payload) {
    state.currentRoom = payload;
  },
  [types.MESSAGES_SET](state, payload) {
    state.messages = payload;
  },
  [types.MESSAGES_SENDING_SET](state, payload) {
    state.messagesSending = payload;
  },
  [types.MESSAGES_IS_LOADING_SET](state, payload) {
    state.isMessagesLoading = payload;
  },
};

/* eslint-disable no-use-before-define */
import { uid } from 'uid';
// eslint-disable-next-line import/no-cycle
import router from '@/router';

import Api from '@/helpers/api';

import * as types from './types';

export default {
  async [types.LOGIN]({ commit, dispatch }, login) {
    commit(types.LOGIN_SET, login);
    dispatch(types.INIT_CONNECT);
    router.push({ name: 'default' });
  },
  async [types.LOGOUT]({ commit }) {
    commit(types.LOGIN_SET, null);
    commit(types.SOCKET_SET, null);
    router.push({ name: 'default' }).catch(() => {});
  },
  async [types.INIT_CONNECT]({ state, dispatch, commit }) {
    commit(types.SOCKET_SET, null);

    if (!state.login) {
      dispatch(types.ROOMS_LIST_FETCH);
      return;
    }

    const connectString = `${process.env.VUE_APP_SOCKET_HOST}?username=${state.login}`;

    const socket = new WebSocket(connectString);

    function onMessage(event) {
      const message = JSON.parse(event.data);

      if (message.room === state.currentRoom) {
        commit(types.MESSAGES_SET, [...state.messages, message]);

        commit(types.ROOMS_SET, state.rooms.map((room) => (room.name === message.room ? { ...room, last_message: message } : room)));
      } else if (state.rooms.find((room) => room.name === message.room)) {
        // eslint-disable-next-line max-len
        commit(types.ROOMS_SET, state.rooms.map((room) => (room.name === message.room ? { ...room, last_message: message, count: room.count + 1 } : room)));
      } else {
        commit(types.ROOMS_SET, [...state.rooms, { name: message.room, last_message: message, count: 0 }]);
      }
    }

    async function onOpen() {
      await dispatch(types.ROOMS_LIST_FETCH);

      if (state.isSocketError && state.currentRoom) {
        await dispatch(types.MESSAGES_FETCH, state.currentRoom);
      }

      await Promise.all(state.messagesSending.map((message) => dispatch(types.MESSAGE_SEND, message)));

      commit(types.SOCKET_ERROR_SET, false);
    }

    function onError(event) {
      commit(types.SOCKET_ERROR_SET, true);
      setTimeout(() => dispatch(types.INIT_CONNECT), 2000);
      console.log(event);
    }

    socket.addEventListener('message', onMessage);
    socket.addEventListener('open', onOpen);
    // socket.addEventListener('error', onError);
    socket.addEventListener('close', onError);

    commit(types.SOCKET_SET, socket);
  },
  async [types.MESSAGE_SEND]({ state, commit }, { room, text, id }) {
    if (!state.socket) return Promise.reject();

    const message = {
      id: id || uid(),
      room,
      text,
    };

    const wasSending = !!state.messagesSending.find((msg) => msg.id === message.id);

    if (room === state.currentRoom && !wasSending) commit(types.MESSAGES_SENDING_SET, [...state.messagesSending, message]);

    // eslint-disable-next-line consistent-return
    return new Promise(((resolve, reject) => {
      function removeEventListeners() {
        state.socket.removeEventListener('message', onMessageCheckSend);
        state.socket.removeEventListener('close', onError);
        state.socket.removeEventListener('error', onError);
      }

      function onMessageCheckSend(event) {
        const receivedMessage = JSON.parse(event.data);

        if (receivedMessage.id === message.id) {
          commit(types.MESSAGES_SENDING_SET, state.messagesSending.filter((msg) => msg.id !== message.id));
          removeEventListeners();
          console.log('resolve');
          resolve();
        }
      }

      function onError() {
        removeEventListeners();
        console.log('reject');
        reject();
      }

      state.socket.addEventListener('message', onMessageCheckSend);
      state.socket.addEventListener('close', onError);
      state.socket.addEventListener('error', onError);
      state.socket.send(JSON.stringify(message));
    }));
  },
  async [types.ROOMS_LIST_FETCH]({ commit }) {
    commit(types.ROOMS_IS_LOADING_SET, true);

    try {
      const rooms = await Api.getRooms();

      commit(types.ROOMS_SET, rooms.map((room) => ({
        ...room,
        count: 0,
      })));
    } finally {
      commit(types.ROOMS_IS_LOADING_SET, false);
    }
  },
  async [types.MESSAGES_FETCH]({ commit }, name) {
    commit(types.MESSAGES_IS_LOADING_SET, true);

    try {
      const messages = await Api.getRoomHistory(name);

      commit(types.MESSAGES_SET, messages);
    } catch (e) {
      if (e.response.status === 404) router.push({ name: 'default' });
      console.log(e.response);
    } finally {
      commit(types.MESSAGES_IS_LOADING_SET, false);
    }
  },
};

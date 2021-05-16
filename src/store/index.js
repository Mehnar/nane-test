import Vue from 'vue';
import Vuex from 'vuex';
import createLocalStorage from 'vuex-persistedstate';

import mutations from './mutations';
// eslint-disable-next-line import/no-cycle
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: null,
    messageSocket: null,

    isSocketError: false,

    isRoomsLoading: false,
    rooms: [],
    currentRoom: null,

    isMessagesLoading: false,
    messages: [],
    messagesSending: [],
  },
  actions,
  mutations,
  getters,
  modules: {},
  plugins: [
    createLocalStorage({
      reducer: (state) => ({
        login: state.login,
      }),
    }),
  ],
});

<template>
  <v-navigation-drawer
    v-model="drawerValue"
    mobile-breakpoint="xs"
    width="300"
    fixed
    app
    clipped
  >
    <v-sheet color="d-flex justify-space-between grey lighten-4" class="pa-4">
      <v-btn
        v-if="!login"
        :to="{ name: 'Login' }"
        link
      >
        Login
      </v-btn>

      <template v-else>
        <span>
          {{ login }}
        </span>

        <v-btn
          @click="logout"
        >
          Logout
        </v-btn>
      </template>

    </v-sheet>

    <v-divider></v-divider>

    <div v-if="isRoomsLoading" class="text-center mt-3">
      <v-progress-circular
        v-if="isRoomsLoading"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>

    <v-list v-else>
      <v-list-item v-for="room in rooms" :key="room.name" :to="{ name: 'Chat', params: { name: room.name} }" link>
        <v-list-item-content>
          <v-list-item-title class="d-flex justify-space-between">
            {{ room.name }}
            <span class="date">
              {{ room.last_message.createdFormatted }}
            </span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <b>
              {{ room.last_message.sender.username }}:
            </b>
            <span>
              {{ room.last_message.text }}
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon v-if="room.count > 0">
          <span class="number-text">{{ room.count }} </span>
        </v-list-item-icon>
      </v-list-item>

      <v-list-item :to="{ name: 'New' }" link exact>
        <v-list-item-content>
          <v-list-item-title>Create new room</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>mdi-message-plus-outline</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import * as types from '@/store/types';

export default {
  props: {
    drawer: {
      type: Boolean,
      default: null,
    },
  },
  computed: {
    drawerValue: {
      get() {
        return this.drawer;
      },
      set(event) {
        this.$emit('update:drawer', event);
      },
    },
    ...mapGetters({
      rooms: types.ROOMS_SORTED_GET,
    }),
    ...mapState([
      'isRoomsLoading',
      'login',
    ]),
  },
  methods: {
    ...mapActions({
      logout: types.LOGOUT,
    }),
  },
};
</script>

<style lang="scss" scoped>
.number-text {
  color: white;
  background-color: #2196F3;
  padding: 0 6px;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 500;
  height: 18px;
  line-height: 19px;
  min-width: 6px;
}
.date {
  font-size: 10px;
}
</style>

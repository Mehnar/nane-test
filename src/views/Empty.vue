<template>
  <v-container class="py-8 px-6" fluid>
    <v-row>
      <v-col cols="12">
        <p class="text-center">
          {{ helloText }}
        </p>
      </v-col>
    </v-row>

    <router-view />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Empty',
  computed: {
    ...mapState([
      'login',
    ]),
    helloText() {
      return `${this.login ? 'S' : 'Login and s'}elect chat to start messaging!`;
    },
  },
};
</script>

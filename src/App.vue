<template>
  <v-app>
    <v-app-bar app color="primary" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <navigation :drawer.sync="drawer" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import Navigation from '@/components/Navigation';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  data: () => ({
    drawer: null,
  }),
  computed: {
    ...mapState([
      'login',
    ]),
  },
  created() {
    if (!this.login) this.$router.push({ name: 'default' });
    this.$store.dispatch(this.$types.INIT_CONNECT);
  },
};
</script>

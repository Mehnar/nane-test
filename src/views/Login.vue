<template>
  <v-dialog
    :value="true"
    width="500"
    persistent
  >
    <v-card>
      <v-card-title class="headline lighten-2">
        Login
      </v-card-title>

      <v-card-text>
        <p>
          Enter your username
        </p>

        <v-input>
          <v-text-field
            v-model="username"
            label="Username"
            :rules="rules"
            hide-details="auto"
            @keydown.enter="onLogin"
          >
          </v-text-field>

        </v-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="onLogin"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    username: null,
    rules: [
      (value) => (value && value.length >= 3) || 'Min 3 characters',
    ],
  }),
  methods: {
    onLogin() {
      if (this.username && this.username.length < 3) return;

      this.$store.dispatch(this.$types.LOGIN, this.username);
    },
  },
};
</script>

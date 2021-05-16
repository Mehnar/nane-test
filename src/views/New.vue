<template>
  <v-dialog
    :value="true"
    width="500"
    persistent
  >
    <v-card>
      <v-card-title class="headline lighten-2">
        Create new room
      </v-card-title>

      <v-card-text>
        <p>
          Enter name for new room:
        </p>

        <v-input>
          <v-text-field
            v-model="roomName"
            label="Room"
            autofocus
            :rules="rules"
            hide-details="auto"
          >
          </v-text-field>

        </v-input>

        <p>
          Enter first message:
        </p>

        <v-textarea
          v-model="text"
          @keydown.enter="sendMessage"
          solo
          no-resize
          hide-details
          :rows="3"
          label="Enter message..."
        >
          <template v-slot:append>
            <v-btn
              color="primary"
              elevation="2"
              icon
              @click="sendMessage"
            >
              <v-icon>
                mdi-send
              </v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </v-card-text>

      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="onLogin"
        >
          Login
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'New',
  data: () => ({
    roomName: null,
    text: null,
    rules: [
      (value) => (value && value.length >= 3) || 'Min 3 characters',
    ],
  }),
  methods: {
    async sendMessage() {
      if (this.roomName.length > 3 && this.text.length > 0) {
        try {
          await this.$store.dispatch(this.$types.MESSAGE_SEND, {
            room: this.roomName,
            text: this.text,
          });

          this.$router.push({ name: 'Chat', params: { name: this.roomName } });
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
};
</script>

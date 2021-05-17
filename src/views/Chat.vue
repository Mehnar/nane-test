<template>
  <v-container class="py-8 px-6" fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-subheader>{{ name }}</v-subheader>

          <div ref="wrapper" class="message-wrapper">
            <v-list two-line class="message-list">
              <template v-for="(message, index) in messages">
                <v-list-item class="message-list--item" :key="message.created">
                  <v-list-item-content>
                    <v-list-item-title class="d-flex justify-space-between">
                      {{message.sender.username}}
                      <span class="message-list--item--date">
                        {{ message.createdFormatted }}
                      </span>
                    </v-list-item-title>

                    <v-list-item-subtitle class="message-list--item--text">
                      {{ message.text }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider :key="`divider-${index}`"></v-divider>
              </template>

              <template v-for="(message, index) in messagesSending">
                <v-list-item class="message-list--item" :key="message.id">
                  <v-list-item-content>
                    <v-list-item-title>{{login}}</v-list-item-title>

                    <v-list-item-subtitle class="message-list--item--text">
                      {{ message.text }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-list-item-icon>
                </v-list-item>

                <v-divider :key="`divider-sended-${index}`"></v-divider>
              </template>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
      >
        <v-textarea
          v-model.trim.lazy="text"
          @keydown.enter="sendMessage"
          solo
          autofocus
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as types from '@/store/types';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Chat',

  data: () => ({
    text: null,
  }),
  beforeDestroy() {
    this.clearMessages();
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
    ...mapGetters({
      messages: types.MESSAGES_GET,
      messagesSending: types.MESSAGES_SENDING_FILTRED_GET,
    }),
    ...mapState([
      'rooms',
      'isMessagesLoading',
      'login',
    ]),
    allMessages() {
      return [...this.messages, ...this.messagesSending];
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler(newVal) {
        this.clearMessages();

        const { name } = newVal.params;

        this.$store.commit(this.$types.ROOM_CURRENT_SET, name);

        await this.$store.dispatch(this.$types.MESSAGES_FETCH, name);
        await this.$nextTick();

        const { wrapper } = this.$refs;

        wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
      },
    },
    async allMessages(newVal) {
      if (!newVal.length) return;
      await this.$nextTick();

      const { wrapper } = this.$refs;

      if (wrapper.scrollTop + wrapper.clientHeight + 200 > wrapper.scrollHeight) {
        wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
      }
    },
  },
  methods: {
    sendMessage() {
      if (!this.text) return;

      this.$store.dispatch(this.$types.MESSAGE_SEND, {
        room: this.name,
        text: this.text,
      });

      this.text = null;
    },
    clearMessages() {
      this.$store.commit(this.$types.ROOM_CURRENT_SET, null);
      this.$store.commit(this.$types.MESSAGES_SET, []);
      this.$store.commit(this.$types.ROOMS_SET, this.rooms.map((room) => (room.name === this.name ? { ...room, count: 0 } : room)));
    },
  },
};
</script>

<style lang="scss" scoped>
.message-wrapper {
  height: calc(100vh - 300px);
  overflow-y: auto;
}
.message-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 100%;
  justify-content: flex-end;

  &--item {
    flex: 0 0 100%;

    &--text {
      overflow: auto;
      text-overflow: unset;
      white-space: pre-line;
    }

    &--date {
      font-size: 10px;
    }
  }
}
</style>

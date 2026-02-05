<template>
  <q-page class="flex flex-center column q-pa-lg bg-grey-2">
    <q-icon name="chat_bubble_outline" size="80px" color="grey-5" />
    <p class="text-h6 text-grey-7 q-mt-md">Select a conversation or start a new chat</p>
    <q-btn unelevated color="primary" label="New chat" icon="add" @click="openNewChat" />
  </q-page>
</template>

<script setup>
import { useChatStore } from 'src/stores/chat'

const chat = useChatStore()
function openNewChat () {
  chat.showNewChatDialog = true
}
</script>

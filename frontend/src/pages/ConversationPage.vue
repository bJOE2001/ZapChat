<template>
  <q-page class="column bg-grey-2" style="height: calc(100vh - 50px);">
    <div v-if="chat.currentConversation" class="q-pa-md bg-white border-bottom flex items-center">
      <q-avatar color="primary" text-color="white" size="40">
        {{ (chat.currentConversation.name || displayName).charAt(0).toUpperCase() }}
      </q-avatar>
      <div class="q-ml-md">
        <div class="text-weight-medium">{{ chat.currentConversation.name || displayName }}</div>
        <div class="text-caption text-grey">{{ chat.currentConversation.type === 'group' ? 'Group' : 'Direct' }}</div>
      </div>
    </div>

    <q-scroll-area
      ref="scrollArea"
      class="col q-pa-md"
      style="flex: 1;"
      @scroll="onScroll"
    >
      <div class="column" style="min-height: 100%;">
        <div
          v-for="msg in chat.messages"
          :key="msg.id"
          class="q-mb-md"
          :class="msg.user_id === auth.user?.id ? 'row justify-end' : 'row justify-start'"
        >
          <div class="column" style="max-width: 75%;">
            <!-- Sender name above the box (group chat only) -->
            <div
              v-if="chat.currentConversation?.type === 'group'"
              class="text-caption q-mb-xs"
              :class="msg.user_id === auth.user?.id ? 'text-right' : 'text-left'"
            >
              {{ msg.user_id === auth.user?.id ? 'You' : (msg.user?.name || 'Unknown') }}
            </div>
            <q-card
              :class="msg.user_id === auth.user?.id ? 'bg-primary text-white' : 'bg-white'"
              flat
              bordered
              class="q-pa-sm rounded-borders"
            >
              <div v-if="msg.body" class="message-body">{{ msg.body }}</div>
              <div v-for="att in msg.attachments" :key="att.id" class="q-mt-xs">
                <a
                  v-if="att.mime_type?.startsWith('image/')"
                  :href="attachmentUrl(att)"
                  target="_blank"
                  rel="noopener"
                >
                  <img :src="attachmentUrl(att)" style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
                </a>
                <a v-else :href="attachmentUrl(att)" target="_blank" rel="noopener" class="text-bold">
                  {{ att.filename }}
                </a>
              </div>
              <div class="text-caption q-mt-xs" :class="msg.user_id === auth.user?.id ? 'text-white' : 'text-grey'">
                {{ formatTime(msg.created_at) }}
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </q-scroll-area>

    <div class="q-pa-md bg-white border-top">
      <q-form @submit="send" class="row q-gutter-sm items-end">
        <q-file
          v-model="fileList"
          multiple
          max-files="3"
          label="Attach"
          outlined
          dense
          style="max-width: 120px;"
          @update:model-value="onFilesSelected"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <q-input
          v-model="body"
          outlined
          dense
          placeholder="Type a message..."
          class="col"
          autogrow
          maxlength="65535"
          @keydown.enter.exact.prevent="send"
        />
        <q-btn type="submit" round color="primary" icon="send" :disable="!body.trim() && pendingFiles.length === 0" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useChatStore } from 'src/stores/chat'
import { api, getApiBaseURL } from 'src/boot/axios'

const route = useRoute()
const auth = useAuthStore()
const chat = useChatStore()

const scrollArea = ref(null)
const body = ref('')
const fileList = ref(null)
const pendingFiles = ref([])
const pollInterval = ref(null)

const conversationId = computed(() => Number(route.params.id))
const displayName = computed(() => {
  if (!chat.currentConversation?.participants) return 'Chat'
  const other = chat.currentConversation.participants.find(p => p.id !== auth.user?.id)
  return other?.name || 'Chat'
})

function attachmentUrl (att) {
  const apiUrl = getApiBaseURL()
  const base = apiUrl.replace(/\/api\/?$/, '')
  return `${base}/storage/${att.path}`
}

function formatTime (iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function onFilesSelected (files) {
  pendingFiles.value = files ? (Array.isArray(files) ? files : [files]) : []
}

async function send () {
  if (!body.value.trim() && pendingFiles.value.length === 0) return
  const b = body.value
  const files = [...pendingFiles.value]
  body.value = ''
  pendingFiles.value = []
  fileList.value = null
  try {
    await chat.sendMessage(conversationId.value, b, files)
    await nextTick()
    scrollToBottom()
  } catch (e) {
    body.value = b
    pendingFiles.value = files
  }
}

function scrollToBottom () {
  nextTick(() => {
    const el = scrollArea.value?.$el?.querySelector('.q-scroll-area__container')
    if (el) el.scrollTop = el.scrollHeight
  })
}

function onScroll () {
  // Optional: load older messages when user scrolls to top (not implemented to keep simple)
}

onMounted(async () => {
  if (!conversationId.value) return
  await chat.fetchConversation(conversationId.value)
  await chat.fetchMessages(conversationId.value)
  scrollToBottom()
  startPolling()
})

onBeforeUnmount(() => {
  if (pollInterval.value) clearInterval(pollInterval.value)
})

watch(conversationId, async (newId, oldId) => {
  if (oldId && pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
  if (!newId) return
  await chat.fetchConversation(newId)
  await chat.fetchMessages(newId)
  scrollToBottom()
  startPolling()
})

function startPolling () {
  if (pollInterval.value) return
  const id = conversationId.value
  pollInterval.value = setInterval(async () => {
    if (chat.currentConversation?.id !== id) return
    const newOnes = await chat.pollNewMessages(id)
    if (newOnes?.length) scrollToBottom()
  }, 3000)
}
</script>

<style scoped>
.message-body {
  white-space: pre-wrap;
  word-break: break-word;
}
.border-bottom { border-bottom: 1px solid rgba(0,0,0,0.08); }
.border-top { border-top: 1px solid rgba(0,0,0,0.08); }
</style>

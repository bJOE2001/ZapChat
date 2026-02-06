<template>
  <q-page class="conversation-page column bg-grey-2">
    <div v-if="chat.currentConversation" class="convo-header q-pa-md bg-white border-bottom flex items-center">
      <q-avatar color="primary" text-color="white" size="40">
        {{ (chat.currentConversation.name || displayName).charAt(0).toUpperCase() }}
      </q-avatar>
      <div class="q-ml-md">
        <div class="text-weight-medium">{{ chat.currentConversation.name || displayName }}</div>
        <div class="text-caption text-grey">{{ chat.currentConversation.type === 'group' ? 'Group' : 'Direct' }}</div>
      </div>
    </div>

    <div class="messages-scroll-wrapper">
      <q-scroll-area ref="scrollAreaRef" class="messages-scroll-area">
        <div class="messages-column q-pa-md">
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
              
              <!-- Image-only message: no box -->
              <template v-if="!msg.body && msg.attachments?.length > 0 && msg.attachments.every(att => isImageAttachment(att))">
                <div v-for="att in msg.attachments" :key="att.id" class="q-mb-xs">
                  <button
                    type="button"
                    class="attachment-image-btn"
                    @click="openImage(att)"
                    :aria-label="`Open image ${att.filename || ''}`"
                  >
                    <img
                      :src="attachmentUrl(att)"
                      :alt="att.filename || 'Image attachment'"
                      class="attachment-image"
                      @error="handleImageError"
                      @load="handleImageLoad"
                    />
                  </button>
                </div>
                <div class="text-caption q-mt-xs" :class="msg.user_id === auth.user?.id ? 'text-primary' : 'text-grey'">
                  {{ formatTime(msg.created_at) }}
                </div>
              </template>
              
              <!-- Message with text or non-image attachments: show box -->
              <q-card
                v-else
                :class="msg.user_id === auth.user?.id ? 'bg-primary text-white' : 'bg-white'"
                flat
                bordered
                class="q-pa-sm rounded-borders"
              >
                <div v-if="msg.body" class="message-body">{{ msg.body }}</div>
                <div v-for="att in msg.attachments" :key="att.id" class="q-mt-xs">
                  <template v-if="isImageAttachment(att)">
                    <button
                      type="button"
                      class="attachment-image-btn"
                      @click="openImage(att)"
                      :aria-label="`Open image ${att.filename || ''}`"
                    >
                      <img
                        :src="attachmentUrl(att)"
                        :alt="att.filename || 'Image attachment'"
                        class="attachment-image"
                        @error="handleImageError"
                        @load="handleImageLoad"
                      />
                    </button>
                  </template>
                  <a v-else :href="attachmentUrl(att)" target="_blank" rel="noopener" class="text-bold attachment-link">
                    <q-icon name="attach_file" class="q-mr-xs" />
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
    </div>

    <!-- Image preview dialog (opens in-app, not a new tab) -->
    <q-dialog v-model="imagePreviewOpen" maximized>
      <q-card class="bg-black text-white">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 ellipsis">{{ imagePreviewName }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-img
            :src="imagePreviewUrl"
            :ratio="16/9"
            fit="contain"
            spinner-color="white"
            class="image-preview"
          />
          <div class="row justify-end q-mt-sm">
            <q-btn
              flat
              no-caps
              icon="open_in_new"
              label="Open in browser"
              :href="imagePreviewUrl"
              target="_blank"
              rel="noopener"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="typing-bar q-pa-md bg-white border-top">
      <q-form @submit="send" class="row q-gutter-sm items-end typing-form">
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
          class="col message-input"
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

const scrollAreaRef = ref(null)
const body = ref('')
const fileList = ref(null)
const pendingFiles = ref([])
const pollInterval = ref(null)

const imagePreviewOpen = ref(false)
const imagePreviewUrl = ref('')
const imagePreviewName = ref('')

const conversationId = computed(() => Number(route.params.id))
const displayName = computed(() => {
  if (!chat.currentConversation?.participants) return 'Chat'
  const other = chat.currentConversation.participants.find(p => p.id !== auth.user?.id)
  return other?.name || 'Chat'
})

function isImageAttachment (att) {
  // Check mime type first
  if (att.mime_type?.startsWith('image/')) {
    return true
  }
  // Fallback: check file extension
  if (att.filename) {
    const ext = att.filename.toLowerCase().split('.').pop()
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
    return imageExts.includes(ext)
  }
  return false
}

function attachmentUrl (att) {
  const apiUrl = getApiBaseURL()
  const base = apiUrl.replace(/\/api\/?$/, '')
  
  // Use the URL from backend if available
  if (att.url) {
    // If URL is already absolute, check if it's from the same origin or convert it
    if (att.url.startsWith('http://') || att.url.startsWith('https://')) {
      // Extract the path from the absolute URL and use our base
      try {
        const urlObj = new URL(att.url)
        return `${base}${urlObj.pathname}`
      } catch (e) {
        // If URL parsing fails, use it as-is
        return att.url
      }
    }
    // If URL is relative, prepend the base URL
    return `${base}${att.url.startsWith('/') ? '' : '/'}${att.url}`
  }
  
  // Fallback: construct URL from path
  return `${base}/storage/${att.path}`
}

function openImage (att) {
  imagePreviewUrl.value = attachmentUrl(att)
  imagePreviewName.value = att?.filename || 'Image'
  imagePreviewOpen.value = true
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

function handleImageError (event) {
  console.error('Failed to load image:', event.target.src)
  // Show error state - keep the image element but mark it as failed
  event.target.style.opacity = '0.5'
  event.target.title = 'Failed to load image'
}

function handleImageLoad (event) {
  // Image loaded successfully - ensure it's visible
  event.target.style.display = 'block'
  event.target.style.opacity = '1'
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
    const q = scrollAreaRef.value
    const el = q?.getScrollTarget?.()
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
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

watch(() => chat.messages.length, () => {
  scrollToBottom()
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
.conversation-page {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.convo-header {
  flex-shrink: 0;
}
/* Wrapper: fixed height so QScrollArea always scrolls when content overflows */
.messages-scroll-wrapper {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
  /* Explicit height so scroll works even when flex parent height is ambiguous */
  height: calc(100vh - 280px);
  max-height: 100%;
}
.messages-scroll-area {
  height: 100%;
  width: 100%;
}
.messages-column {
  min-height: min-content;
}
.message-body {
  white-space: pre-wrap;
  word-break: break-word;
}
/* Typing bar: fixed height so it never steals space from the message area */
.typing-bar {
  flex-shrink: 0;
  flex-grow: 0;
  max-height: 160px;
  overflow: hidden;
}
.typing-form {
  min-height: 0;
}
.message-input :deep(.q-field__native) {
  max-height: 100px;
  overflow-y: auto;
}
.message-input :deep(.q-field__control-container) {
  max-height: 100px;
}
.border-bottom { border-bottom: 1px solid rgba(0,0,0,0.08); }
.border-top { border-top: 1px solid rgba(0,0,0,0.08); }
.attachment-image-btn {
  display: inline-block;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
}
.attachment-image-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.65);
  outline-offset: 2px;
}
.attachment-image {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  display: block;
  object-fit: contain;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: none;
  background: transparent;
  padding: 0;
  margin: 0;
}
.attachment-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}
.image-preview {
  width: 100%;
  height: calc(100vh - 120px);
}
</style>

<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">ZapChat</q-toolbar-title>
        <q-space />
        <q-btn flat round dense :to="{ name: 'profile' }" class="q-mr-sm">
          <q-avatar size="36" color="white" text-color="primary">
            {{ (auth.user?.name || '?').charAt(0).toUpperCase() }}
          </q-avatar>
        </q-btn>
        <span class="q-mr-md text-body2">{{ auth.user?.name }}</span>
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :width="320"
      class="bg-white column"
    >
      <q-toolbar class="bg-primary text-white">
        <q-btn flat round dense icon="add" @click="chat.showNewChatDialog = true" />
        <q-space />
        <q-toolbar-title>Chats</q-toolbar-title>
      </q-toolbar>
      <q-scroll-area class="col">
        <q-list>
          <q-item
            v-for="conv in chat.conversations"
            :key="conv.id"
            clickable
            v-ripple
            :active="route.params.id === String(conv.id)"
            active-class="bg-primary-1"
            :to="`/c/${conv.id}`"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="42">
                {{ (conv.name || '?').charAt(0).toUpperCase() }}
              </q-avatar>
              <q-badge
                v-if="conv.unread_count > 0"
                floating
                color="red"
                :label="conv.unread_count > 99 ? '99+' : conv.unread_count"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ conv.name || 'Chat' }}</q-item-label>
              <q-item-label caption>
                {{ conv.last_message ? (conv.last_message.body || '(attachment)').slice(0, 40) : 'No messages' }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="more_vert"
                size="sm"
                @click.stop
              >
                <q-menu auto-close>
                  <q-list style="min-width: 180px">
                    <q-item clickable v-close-popup @click="confirmDeleteConv(conv)">
                      <q-item-section avatar>
                        <q-icon name="delete_outline" color="negative" />
                      </q-item-section>
                      <q-item-section>Delete conversation</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
          <q-item v-if="chat.conversations.length === 0 && !chat.loading">
            <q-item-section class="text-center text-grey">No chats yet. Start one!</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="q-pa-md bg-grey-2 border-top flex flex-center">
        <q-btn
          unelevated
          color="primary"
          icon="smart_toy"
          label="Chat with Bototoy"
          no-caps
          class="rounded-borders bototoy-float"
          padding="10px 16px"
          @click="startAiChat"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-white text-grey-8">
      <q-tabs
        v-model="navTab"
        no-pane-border
        dense
        align="justify"
        active-color="primary"
        indicator-color="primary"
        class="nav-tabs"
      >
        <q-tab name="chat" icon="chat" label="Chat" @click="router.push('/')" />
        <q-tab name="games" icon="games" label="Games" @click="router.push('/games')" />
        <q-tab name="profile" icon="person" label="Profile" @click="router.push('/profile')" />
      </q-tabs>
    </q-footer>

    <q-dialog v-model="chat.showNewChatDialog" persistent>
      <q-card style="min-width: 360px">
        <q-card-section class="row items-center q-pb-none">
          <h6 class="q-ma-none">New conversation</h6>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-btn
            outline
            color="primary"
            icon="smart_toy"
            label="Chat with Bototoy"
            class="q-mb-md full-width"
            @click="startAiChat"
          />
          <q-option-group
            v-model="newChatType"
            :options="[
              { label: '1-on-1', value: 'direct' },
              { label: 'Group', value: 'group' }
            ]"
            color="primary"
            inline
          />
          <q-select
            v-model="selectedUserIds"
            :options="userOptions"
            option-value="id"
            option-label="name"
            label="Select user(s)"
            multiple
            use-chips
            use-input
            emit-value
            map-options
            input-debounce="300"
            @filter="searchUsers"
            class="q-mt-sm"
          />
          <q-input
            v-if="newChatType === 'group'"
            v-model="newGroupName"
            label="Group name"
            class="q-mt-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="primary" label="Start chat" :disable="!canStartChat" @click="startChat" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete conversation confirmation -->
    <q-dialog v-model="showDeleteConvDialog" persistent>
      <q-card style="min-width: 320px">
        <q-card-section>
          <div class="text-h6">Delete conversation</div>
          <div class="text-body2 q-mt-sm text-grey-8">
            Remove "{{ convToDelete?.name || 'Chat' }}" from your conversations?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat color="primary" label="Delete" @click="doDeleteConv" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useChatStore } from 'src/stores/chat'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const chat = useChatStore()
const $q = useQuasar()

const drawer = ref(true)
const showDeleteConvDialog = ref(false)
const convToDelete = ref(null)
const navTab = ref('chat')
const newChatType = ref('direct')
const newGroupName = ref('')
const selectedUserIds = ref([])
const userOptions = ref([])
const userSearchCache = ref({})

function getNavTabFromRoute () {
  const name = route.name
  if (name === 'inbox' || name === 'conversation') return 'chat'
  if (name === 'games' || name?.startsWith('game-')) return 'games'
  if (name === 'profile') return 'profile'
  return 'chat'
}
watch(() => route.name, () => { navTab.value = getNavTabFromRoute() }, { immediate: true })

const canStartChat = computed(() => {
  if (newChatType.value === 'direct') return selectedUserIds.value.length === 1
  return selectedUserIds.value.length >= 1 && !!newGroupName.value?.trim()
})

async function searchUsers (val, update) {
  if (!val) {
    update(() => { userOptions.value = [] })
    return
  }
  const { data } = await api.get('/users', { params: { q: val } })
  update(() => { userOptions.value = data.users })
}

async function startAiChat () {
  try {
    const { data } = await api.get('/ai-user')
    const conv = await chat.createConversation('direct', [data.id], null)
    chat.showNewChatDialog = false
    router.push(`/c/${conv.id}`)
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Could not start chat with Bototoy' })
  }
}

async function startChat () {
  try {
    const conv = await chat.createConversation(
      newChatType.value,
      selectedUserIds.value,
      newChatType.value === 'group' ? newGroupName.value : null
    )
    selectedUserIds.value = []
    newGroupName.value = ''
    chat.showNewChatDialog = false
    router.push(`/c/${conv.id}`)
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Failed to start chat' })
  }
}

function handleLogout () {
  auth.logout()
  router.replace('/login')
}

function confirmDeleteConv (conv) {
  convToDelete.value = conv
  showDeleteConvDialog.value = true
}

async function doDeleteConv () {
  const conv = convToDelete.value
  if (!conv) return
  try {
    const wasActive = route.params.id === String(conv.id)
    await chat.deleteConversation(conv.id)
    if (wasActive) router.push('/')
    $q.notify({ type: 'positive', message: 'Conversation removed' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Failed to delete conversation' })
  } finally {
    convToDelete.value = null
    showDeleteConvDialog.value = false
  }
}

onMounted(() => {
  chat.fetchConversations()
})
</script>

<style scoped>
.bototoy-float {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>

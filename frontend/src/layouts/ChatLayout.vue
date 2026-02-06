<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="route.name === 'conversation'"
          flat
          round
          dense
          icon="arrow_back"
          @click="router.push('/')"
        />
        <q-toolbar-title class="text-weight-bold">ZapChat</q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="people" class="q-mr-sm" @click="rightDrawer = !rightDrawer" />
        <q-btn flat round dense class="q-mr-sm" @click="goToProfileOrClose">
          <q-avatar size="36" color="white" text-color="primary">
            {{ (auth.user?.name || '?').charAt(0).toUpperCase() }}
          </q-avatar>
        </q-btn>
        <q-btn
          flat
          dense
          no-caps
          class="q-mr-md text-body2 text-white"
          :label="auth.user?.name"
          @click="goToProfileOrClose"
        />
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :width="320"
      :class="$q.dark?.isActive ? 'drawer-dark' : 'bg-white column'"
    >
      <q-toolbar :class="$q.dark?.isActive ? 'drawer-toolbar-dark' : 'bg-primary text-white'">
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
              <div class="avatar-with-status relative-position">
                <q-avatar color="primary" text-color="white" size="42">
                  {{ (conv.name || '?').charAt(0).toUpperCase() }}
                </q-avatar>
                <span
                  class="status-dot absolute"
                  :class="conv.online ? 'bg-green' : 'bg-grey-5'"
                />
                <q-badge
                  v-if="conv.unread_count > 0"
                  floating
                  color="red"
                  :label="conv.unread_count > 99 ? '99+' : conv.unread_count"
                />
              </div>
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

    <q-drawer
      v-model="rightDrawer"
      show-if-above
      bordered
      side="right"
      :width="320"
      :class="$q.dark?.isActive ? 'drawer-dark' : 'bg-white'"
    >
      <q-toolbar :class="$q.dark?.isActive ? 'drawer-toolbar-dark' : 'bg-primary text-white'">
        <q-toolbar-title>Friends</q-toolbar-title>
        <q-btn flat round dense icon="add" @click="openAddFriend" />
      </q-toolbar>
      <q-scroll-area class="fit">
        <q-list v-if="friendsList.length > 0">
          <q-item
            v-for="friend in friendsList"
            :key="friend.id"
            clickable
            v-ripple
            :active="route.params.id === String(friend.conversationId)"
            active-class="bg-primary-1"
            :to="`/c/${friend.conversationId}`"
            class="q-py-sm"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="40">
                {{ (friend.name || '?').charAt(0).toUpperCase() }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ friend.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item v-else class="text-center text-grey">
          <q-item-section>
            <div class="text-body2">No friends yet.</div>
            <div class="text-caption q-mt-xs">Tap + to search by name and start a conversation.</div>
          </q-item-section>
        </q-item>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="chat-page-container">
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
        <q-tab name="stories" icon="auto_stories" label="Stories" @click="router.push('/stories')" />
        <q-tab name="games" icon="games" label="Games" @click="router.push('/games')" />
        <q-tab name="notifications" icon="notifications" label="Notifications" @click="router.push('/notifications')" />
        <q-tab name="profile" icon="person" label="Profile" @click="router.push('/profile')" />
      </q-tabs>
    </q-footer>

    <q-dialog v-model="chat.showNewChatDialog" persistent @hide="addFriendDialogMode = false">
      <q-card style="min-width: 360px">
        <q-card-section class="row items-center q-pb-none">
          <h6 class="q-ma-none">{{ addFriendDialogMode ? 'Add friend' : 'New conversation' }}</h6>
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
            v-if="!addFriendDialogMode"
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
            :label="addFriendDialogMode ? 'Search by name' : 'Select user(s)'"
            :multiple="!addFriendDialogMode"
            use-chips
            use-input
            emit-value
            map-options
            input-debounce="300"
            @filter="searchUsers"
            class="q-mt-sm"
          />
          <q-input
            v-if="newChatType === 'group' && !addFriendDialogMode"
            v-model="newGroupName"
            label="Group name"
            class="q-mt-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            :label="addFriendDialogMode ? 'Start conversation' : 'Start chat'"
            :disable="!canStartChat"
            @click="startChat"
          />
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
const rightDrawer = ref(false)
const showDeleteConvDialog = ref(false)
const convToDelete = ref(null)
const navTab = ref('chat')
const addFriendDialogMode = ref(false)
const newChatType = ref('direct')
const newGroupName = ref('')
const selectedUserIds = ref([])
const userOptions = ref([])
const userSearchCache = ref({})

function getNavTabFromRoute () {
  const name = route.name
  if (name === 'inbox' || name === 'conversation') return 'chat'
  if (name === 'stories') return 'stories'
  if (name === 'games' || name?.startsWith('game-')) return 'games'
  if (name === 'notifications') return 'notifications'
  if (name === 'profile') return 'profile'
  return 'chat'
}
watch(() => route.name, () => { navTab.value = getNavTabFromRoute() }, { immediate: true })

function openAddFriend () {
  addFriendDialogMode.value = true
  newChatType.value = 'direct'
  selectedUserIds.value = []
  newGroupName.value = ''
  chat.showNewChatDialog = true
}

const canStartChat = computed(() => {
  const ids = selectedUserIds.value
  const hasOne = Array.isArray(ids) ? ids.length === 1 : ids != null && ids !== ''
  const hasAny = Array.isArray(ids) ? ids.length >= 1 : ids != null && ids !== ''
  if (newChatType.value === 'direct' || addFriendDialogMode.value) return hasOne
  return hasAny && !!newGroupName.value?.trim()
})

const friendsList = computed(() => {
  const list = []
  const seen = new Set()
  const myId = auth.user?.id
  if (!myId) return list
  for (const conv of chat.conversations) {
    for (const p of conv.participants || []) {
      if (p.id !== myId && !seen.has(p.id)) {
        seen.add(p.id)
        list.push({ id: p.id, name: p.name, conversationId: conv.id })
      }
    }
  }
  return list
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
    const participantIds = Array.isArray(selectedUserIds.value)
      ? selectedUserIds.value
      : (selectedUserIds.value != null ? [selectedUserIds.value] : [])
    const conv = await chat.createConversation(
      newChatType.value,
      participantIds,
      newChatType.value === 'group' ? newGroupName.value : null
    )
    selectedUserIds.value = []
    newGroupName.value = ''
    chat.showNewChatDialog = false
    if (addFriendDialogMode.value) rightDrawer.value = false
    router.push(`/c/${conv.id}`)
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Failed to start chat' })
  }
}

function goToProfileOrClose () {
  if (route.name === 'profile') {
    router.back()
  } else {
    router.push({ name: 'profile' })
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
.avatar-with-status {
  display: inline-block;
}
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  bottom: 0;
  right: 0;
  border: 2px solid white;
}
</style>

<style>
/* Only chats panel, message conversation, and friends panel scroll — not the whole page */
.chat-page-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  max-height: 100%;
}
.chat-page-container .q-page {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 100%;
}
</style>

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
      class="bg-white"
    >
      <q-toolbar class="bg-primary text-white">
        <q-btn flat round dense icon="add" @click="chat.showNewChatDialog = true" />
        <q-space />
        <q-toolbar-title>Chats</q-toolbar-title>
      </q-toolbar>
      <q-scroll-area class="fit">
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
    </q-drawer>

    <q-drawer
      v-model="rightDrawer"
      show-if-above
      bordered
      side="right"
      :width="320"
      class="bg-white"
    >
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>People</q-toolbar-title>
      </q-toolbar>
      <q-scroll-area class="fit">
        <q-list v-if="usersList.length > 0">
          <q-item v-for="user in usersList" :key="user.id" class="q-py-sm">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="40">
                {{ (user.name || '?').charAt(0).toUpperCase() }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ user.name }}</q-item-label>
              <q-item-label caption>{{ user.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                icon="add"
                size="sm"
                color="primary"
                :loading="addingUserId === user.id"
                @click="startConversationWithUser(user)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-item v-else-if="usersLoading" class="flex flex-center">
          <q-spinner color="primary" size="2em" />
        </q-item>
        <q-item v-else class="text-center text-grey">
          <q-item-section>No other users yet.</q-item-section>
        </q-item>
      </q-scroll-area>
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
        <q-tab name="stories" icon="auto_stories" label="Stories" @click="router.push('/stories')" />
        <q-tab name="notifications" icon="notifications" label="Notifications" @click="router.push('/notifications')" />
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
const rightDrawer = ref(false)
const showDeleteConvDialog = ref(false)
const convToDelete = ref(null)
const navTab = ref('chat')
const usersList = ref([])
const usersLoading = ref(false)
const addingUserId = ref(null)

function getNavTabFromRoute () {
  const name = route.name
  if (name === 'inbox' || name === 'conversation') return 'chat'
  if (name === 'stories') return 'stories'
  if (name === 'notifications') return 'notifications'
  if (name === 'profile') return 'profile'
  return 'chat'
}
watch(() => route.name, () => { navTab.value = getNavTabFromRoute() }, { immediate: true })

watch(rightDrawer, (open) => {
  if (open && usersList.value.length === 0) fetchUsers()
})

async function fetchUsers () {
  usersLoading.value = true
  try {
    const { data } = await api.get('/users')
    usersList.value = data.users || []
  } catch (e) {
    usersList.value = []
    $q.notify({ type: 'negative', message: 'Failed to load users' })
  } finally {
    usersLoading.value = false
  }
}

async function startConversationWithUser (user) {
  addingUserId.value = user.id
  try {
    const conv = await chat.createConversation('direct', [user.id], null)
    rightDrawer.value = false
    router.push(`/c/${conv.id}`)
    $q.notify({ type: 'positive', message: `Started chat with ${user.name}` })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Failed to start conversation' })
  } finally {
    addingUserId.value = null
  }
}
const newChatType = ref('direct')
const newGroupName = ref('')
const selectedUserIds = ref([])
const userOptions = ref([])
const userSearchCache = ref({})

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

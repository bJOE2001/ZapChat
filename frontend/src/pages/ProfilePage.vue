<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-lg column items-center">
      <!-- Circular profile picture with edit text at bottom -->
      <div class="profile-avatar-wrap q-mb-lg">
        <q-avatar
          size="220"
          color="primary"
          text-color="white"
          font-size="88px"
          class="profile-avatar"
        >
          <q-img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            fit="cover"
            class="full-height full-width"
          />
          <span v-else>{{ (auth.user?.name || '?').charAt(0).toUpperCase() }}</span>
        </q-avatar>
        <label class="profile-edit-avatar">
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="onProfileImageChange"
          />
          <span class="edit-avatar-label">Edit avatar</span>
        </label>
      </div>

      <!-- Full name -->
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-md text-center">
        {{ auth.user?.name || 'User' }}
      </div>
      <div class="text-body2 text-grey-7 q-mb-lg text-center">{{ auth.user?.email }}</div>

      <!-- Bio section -->
      <q-card flat bordered class="bio-card q-mb-lg" style="min-width: 100%; max-width: 480px;">
        <q-card-section class="row items-center">
          <span class="text-subtitle1 text-weight-medium">Bio</span>
          <q-space />
          <q-btn
            v-if="!bio && !editingBio"
            flat
            dense
            no-caps
            color="primary"
            icon="add"
            label="Add bio"
            @click="editingBio = true"
          />
          <q-btn
            v-else-if="!editingBio"
            flat
            dense
            no-caps
            color="primary"
            icon="edit"
            label="Edit bio"
            @click="editingBio = true"
          />
          <template v-else>
            <q-btn flat dense label="Cancel" @click="cancelEditBio" />
            <q-btn unelevated dense color="primary" label="Save" @click="saveBio" />
          </template>
        </q-card-section>
        <q-card-section v-if="editingBio" class="q-pt-none">
          <q-input
            v-model="bioDraft"
            type="textarea"
            outlined
            autofocus
            placeholder="Tell others about yourself..."
            rows="4"
            maxlength="500"
            counter
            class="bio-input"
          />
        </q-card-section>
        <q-card-section v-else class="q-pt-none">
          <p v-if="bio" class="text-body2 text-grey-8 q-ma-none">{{ bio }}</p>
          <p v-else class="text-body2 text-grey-5 q-ma-none italic">No bio yet.</p>
        </q-card-section>
      </q-card>

      <!-- Message requests section -->
      <q-card flat bordered class="message-requests-card q-mb-lg" style="min-width: 100%; max-width: 480px;">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">Message requests</div>
          <q-list v-if="chat.messageRequests.length > 0" bordered class="rounded-borders">
            <q-item v-for="req in chat.messageRequests" :key="req.id" class="q-py-sm">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="44">
                  {{ (req.name || '?').charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ req.name || 'Chat' }}</q-item-label>
                <q-item-label caption>
                  {{ req.last_message ? (req.last_message.body || '(attachment)').slice(0, 50) : 'No messages yet' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  unelevated
                  dense
                  color="primary"
                  label="Accept"
                  :loading="acceptingId === req.id"
                  @click="acceptRequest(req)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <p v-else-if="messageRequestsLoading" class="text-body2 text-grey-6 q-ma-none text-center q-py-md">
            Loading...
          </p>
          <p v-else class="text-body2 text-grey-5 q-ma-none italic">No message requests.</p>
        </q-card-section>
      </q-card>

      <!-- Settings section -->
      <q-card flat bordered class="settings-card" style="min-width: 100%; max-width: 480px;">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">Settings</div>
          <q-list bordered class="rounded-borders">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="notifications" color="primary" />
              </q-item-section>
              <q-item-section>Notifications</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="lock" color="primary" />
              </q-item-section>
              <q-item-section>Privacy & security</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey" />
              </q-item-section>
            </q-item>
            <q-expansion-item
              icon="palette"
              label="Appearance"
              header-class="text-primary"
              expand-icon-class="text-grey"
            >
              <q-card flat bordered class="q-mx-sm q-mb-sm">
                <q-card-section class="q-pt-none">
                  <div class="text-caption text-grey-7 q-mb-sm">Theme</div>
                  <q-item class="q-px-none">
                    <q-item-section>Dark mode</q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="darkMode"
                        color="primary"
                        @update:model-value="onDarkModeChange"
                      />
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useChatStore } from 'src/stores/chat'

const auth = useAuthStore()
const chat = useChatStore()
const router = useRouter()
const $q = useQuasar()
const messageRequestsLoading = ref(false)
const acceptingId = ref(null)

const DARK_MODE_KEY = 'zapchat_dark_mode'
const darkMode = ref($q.dark?.isActive ?? false)

function onDarkModeChange (value) {
  $q.dark?.set(value)
  try {
    localStorage.setItem(DARK_MODE_KEY, value ? '1' : '0')
  } catch (e) {}
}

const BIO_KEY = 'zapchat_profile_bio'
const AVATAR_KEY = 'zapchat_profile_avatar'

const profileImageUrl = ref(null)

function getAvatarStorageKey () {
  return auth.user?.id ? `${AVATAR_KEY}_${auth.user.id}` : null
}

function loadProfileImage () {
  const key = getAvatarStorageKey()
  if (key) {
    const data = localStorage.getItem(key)
    profileImageUrl.value = data || auth.user?.avatar_url || null
  } else {
    profileImageUrl.value = auth.user?.avatar_url || null
  }
}

function onProfileImageChange (e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result
    const key = getAvatarStorageKey()
    if (key) {
      try {
        localStorage.setItem(key, dataUrl)
        profileImageUrl.value = dataUrl
        $q.notify({ type: 'positive', message: 'Profile photo updated' })
      } catch (err) {
        $q.notify({ type: 'negative', message: 'Image too large to save' })
      }
    }
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

const bio = ref('')
const bioDraft = ref('')
const editingBio = ref(false)

function getBioStorageKey () {
  return auth.user?.id ? `${BIO_KEY}_${auth.user.id}` : null
}

function loadBio () {
  const key = getBioStorageKey()
  if (key) {
    bio.value = localStorage.getItem(key) || ''
  }
}

function saveBio () {
  const key = getBioStorageKey()
  if (key) {
    bio.value = bioDraft.value.trim()
    localStorage.setItem(key, bio.value)
  }
  editingBio.value = false
}

function cancelEditBio () {
  bioDraft.value = bio.value
  editingBio.value = false
}

async function loadMessageRequests () {
  messageRequestsLoading.value = true
  try {
    await chat.fetchMessageRequests()
  } finally {
    messageRequestsLoading.value = false
  }
}

async function acceptRequest (req) {
  acceptingId.value = req.id
  try {
    await chat.acceptMessageRequest(req.id)
    router.push(`/c/${req.id}`)
  } catch (e) {
    await loadMessageRequests()
  } finally {
    acceptingId.value = null
  }
}

watch(editingBio, (isEditing) => {
  if (isEditing) bioDraft.value = bio.value
})

onMounted(() => {
  loadBio()
  bioDraft.value = bio.value
  loadProfileImage()
  loadMessageRequests()
  try {
    const saved = localStorage.getItem(DARK_MODE_KEY)
    if (saved !== null) {
      const isDark = saved === '1'
      darkMode.value = isDark
      $q.dark?.set(isDark)
    }
  } catch (e) {}
})
</script>

<style scoped>
.profile-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-radius: 50%;
}
/* Fit image inside circle: scale to cover, centered, no overflow */
.profile-avatar :deep(.q-img__content),
.profile-avatar :deep(.q-img__image) {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}
.profile-avatar :deep(img) {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}
.profile-edit-avatar {
  cursor: pointer;
  display: block;
}
.profile-edit-avatar .edit-avatar-label {
  font-size: 0.875rem;
  color: var(--q-primary);
  text-decoration: underline;
}
.profile-edit-avatar:hover .edit-avatar-label {
  opacity: 0.85;
}
.profile-edit-avatar .hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
.bio-card .bio-input :deep(.q-field__control) {
  min-height: 80px;
}
.italic {
  font-style: italic;
}
</style>

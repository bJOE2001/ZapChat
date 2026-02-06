<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-lg column items-center">
      <!-- Circular profile picture with fallback avatar -->
      <div class="q-mb-lg">
        <q-avatar
          size="120"
          color="primary"
          text-color="white"
          font-size="48px"
          class="profile-avatar"
        >
          <q-img
            v-if="auth.user?.avatar_url"
            :src="auth.user.avatar_url"
            fit="cover"
            class="full-height full-width"
          />
          <span v-else>{{ (auth.user?.name || '?').charAt(0).toUpperCase() }}</span>
        </q-avatar>
      </div>

      <!-- Full name -->
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-md">
        {{ auth.user?.name || 'User' }}
      </div>
      <div class="text-body2 text-grey-7 q-mb-lg">{{ auth.user?.email }}</div>

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
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="palette" color="primary" />
              </q-item-section>
              <q-item-section>Appearance</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()

const BIO_KEY = 'zapchat_profile_bio'

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

watch(editingBio, (isEditing) => {
  if (isEditing) bioDraft.value = bio.value
})

onMounted(() => {
  loadBio()
  bioDraft.value = bio.value
})
</script>

<style scoped>
.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
.bio-card .bio-input :deep(.q-field__control) {
  min-height: 80px;
}
.italic {
  font-style: italic;
}
</style>

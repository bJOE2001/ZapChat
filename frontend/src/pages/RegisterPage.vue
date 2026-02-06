<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <q-card flat bordered class="q-pa-lg" style="min-width: 360px;">
      <q-card-section>
        <div class="text-h5 text-weight-bold text-primary q-mb-md">ZapChat</div>
        <div class="text-subtitle2 text-grey-7 q-mb-lg">Create an account</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="name"
            outlined
            label="Name"
            :rules="[val => !!val || 'Name is required']"
            lazy-rules
          />
          <q-input
            v-model="email"
            outlined
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
            lazy-rules
          />
          <q-input
            v-model="password"
            outlined
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[val => (val && val.length >= 8) || 'Min 8 characters']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
            </template>
          </q-input>
          <q-input
            v-model="passwordConfirmation"
            outlined
            label="Confirm password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[val => val === password || 'Passwords must match']"
            lazy-rules
          />
          <q-btn unelevated color="primary" type="submit" label="Register" class="full-width" :loading="loading" />
          <div class="text-center text-body2">
            Already have an account?
            <router-link to="/login" class="text-primary">Login</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const auth = useAuthStore()
const $q = useQuasar()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onSubmit () {
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value, passwordConfirmation.value)
    $q.notify({ type: 'positive', message: 'Account created' })
    router.replace('/')
  } catch (e) {
    let msg = 'Registration failed'
    if (!e.response) {
      msg = 'Cannot reach server. Is the backend running? (Start it with: cd backend && php artisan serve)'
    } else if (e.response.data?.errors) {
      msg = Object.values(e.response.data.errors).flat().join(' ')
    } else if (e.response.data?.message) {
      msg = e.response.data.message
    } else if (e.response.status >= 500) {
      msg = `Server error (${e.response.status}). Check backend logs.`
    } else if (e.response.status) {
      msg = `Request failed (${e.response.status}). ${msg}`
    }
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fullscreen bg-grey-2 flex flex-center">
    <q-card flat bordered class="q-pa-lg" style="min-width: 360px;">
      <q-card-section>
        <div class="text-h5 text-weight-bold text-primary q-mb-md">ZapChat</div>
        <div class="text-subtitle2 text-grey-7 q-mb-lg">Sign in to continue</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
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
            :rules="[val => !!val || 'Password is required']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
            </template>
          </q-input>
          <q-btn unelevated color="primary" type="submit" label="Login" class="full-width" :loading="loading" />
          <div class="text-center text-body2">
            Don't have an account?
            <router-link to="/register" class="text-primary">Register</router-link>
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

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onSubmit () {
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    $q.notify({ type: 'positive', message: 'Logged in' })
    router.replace('/')
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Login failed' })
  } finally {
    loading.value = false
  }
}
</script>

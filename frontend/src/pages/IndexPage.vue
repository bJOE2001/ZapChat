<template>
  <q-page class="flex flex-center column q-pa-md">
    <h4 class="q-mb-md">ZapChat</h4>
    <p class="text-body1 q-mb-lg">Quasar (Vue 3) + Laravel REST API</p>
    <q-card flat bordered class="q-pa-lg" style="min-width: 280px">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">API health:</div>
        <q-spinner v-if="loading" size="24px" />
        <div v-else-if="apiStatus" class="text-positive">{{ apiStatus }}</div>
        <div v-else-if="apiError" class="text-negative">{{ apiError }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" label="Check API" @click="checkApi" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../boot/axios'

const loading = ref(false)
const apiStatus = ref('')
const apiError = ref('')

async function checkApi () {
  loading.value = true
  apiStatus.value = ''
  apiError.value = ''
  try {
    const { data } = await api.get('/health')
    apiStatus.value = data.message || 'OK'
  } catch (err) {
    apiError.value = err.message || 'Failed to reach API. Is Laravel running on port 8000?'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

onMounted(() => {
  try {
    const saved = localStorage.getItem('zapchat_dark_mode')
    if (saved !== null && $q.dark) {
      $q.dark.set(saved === '1')
    }
  } catch (e) {}
})
</script>

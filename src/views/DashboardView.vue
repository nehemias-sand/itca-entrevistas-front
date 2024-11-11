<template>
  <div class="bg-white p-5 rounded-lg shadow-xl text-center mt-5">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Bienvenido, {{ username }}</h1>
    <p class="text-xl text-gray-600">Es un placer tenerte de vuelta en el sistema.</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { computed } from 'vue'

const authStore = useAuthStore()
const username = computed(() => authStore.user?.username || 'Usuario')
</script>

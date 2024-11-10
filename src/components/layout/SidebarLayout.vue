<template>
  <aside class="w-64 h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out">
    <!-- Header con logo -->
    <div class="p-4 border-b border-gray-200">
      <img
        src="https://www.itca.edu.sv/wp-content/uploads/2024/01/Logo55Web_1700x379.png"
        alt="Logo Universidad"
        class="w-full object-contain h-12"
      />
    </div>

    <!-- Navegación -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-2 px-3">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 hover:text-[#b1291d] shadow-sm hover:shadow-md"
            :class="{ 'bg-[#b1291d] text-white hover:bg-[#9e2219] hover:text-white shadow-md': isCurrentRoute(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer con opciones de usuario -->
    <div class="p-4 border-t border-gray-200">
      <ul class="space-y-2">
        <li>
          <router-link
            to="/cambiar-contrasena"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 hover:bg-gray-100 hover:text-[#b1291d] shadow-sm hover:shadow-md"
            :class="{ 'bg-[#b1291d] text-white hover:bg-[#9e2219] hover:text-white shadow-md': isCurrentRoute('/cambiar-contrasena') }"
          >
            Cambiar contraseña
          </router-link>
        </li>
        <li>
          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 hover:bg-gray-100 hover:text-[#b1291d] text-gray-700 shadow-sm hover:shadow-md"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const perfil = computed(() => authStore.user?.perfil || 'GUEST')

const isCurrentRoute = (path: string) => {
  return route.path === path
}

const commonItems = [{ name: 'Dashboard', path: '/dashboard' }]

const menuItems = computed(() => {
  const adminItems = [
    { name: 'Gestión de Usuarios', path: '/usuarios' },
    { name: 'Gestión de Docentes', path: '/docentes' },
    { name: 'Gestión de Estudiantes', path: '/estudiantes' },
    { name: 'Gestión de Carreras', path: '/carreras' },
    { name: 'Gestión de Ciclos', path: '/ciclos' },
    { name: 'Gestión de Preguntas', path: '/preguntas' },
    { name: 'Gestión de Catalogos', path: '/catalogos' },
    { name: 'Gestión de Resultados', path: '/resultados' }
  ]

  const docenteItems = [
    { name: 'Resultados', path: '/resultados' },
    { name: 'Evaluación de Estudiantes', path: '/evaluacion' }
  ]

  if (perfil.value === 'ADMIN') {
    return [...commonItems, ...adminItems]
  } else if (perfil.value === 'DOCENTE') {
    return [...commonItems, ...docenteItems]
  } else {
    return []
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.router-link-active {
  @apply bg-[#b1291d] text-white shadow-md;
}
</style>

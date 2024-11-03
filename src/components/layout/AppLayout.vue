<template>
  <div class="flex h-screen flex-col">
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />
      <main class="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <header class="bg-gray-50 shadow-sm">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ currentRouteName }}
            </h1>
          </div>
        </header>
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <router-view></router-view>
          </div>
        </div>
        <footer class="bg-white shadow-md">
          <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">
                © {{ currentYear }} ITCA-FEPADE. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './SidebarLayout.vue'

const route = useRoute()

const currentRouteName = computed(() => {
  const routeNames = {
    Dashboard: 'Panel de Control',
    Usuarios: 'Gestión de Usuarios',
    Docentes: 'Gestión de Docentes',
    Estudiantes: 'Gestión de Estudiantes',
    Carreras: 'Gestión de Carreras',
    Ciclos: 'Gestión de Ciclos',
    Preguntas: 'Gestión de Preguntas',
    CatalogoPreguntas: 'Catálogo de Preguntas',
    Resultados: 'Resultados de Entrevistas',
    Entrevistas: 'Mis Entrevistas',
    EstudianteEvaluacion: 'Evaluación de Estudiantes'
  }

  return routeNames[route.name as keyof typeof routeNames] || 'Dashboard'
})

const currentYear = computed(() => new Date().getFullYear())
</script>
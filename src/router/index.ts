import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'

import LoginView from '../views/LoginView.vue'
import NotFound from '../views/NotFoundView.vue'
import Forbidden from '../views/ForbiddenView.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { computed } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/cambiar-contrasena',
      name: 'ChangePassword',
      component: () => import('../views/ChangePasswordView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'Layout',
      component: AppLayout,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN', 'DOCENTE'] }
        },
        {
          path: '/usuarios',
          name: 'Usuarios',
          component: () => import('../views/Admin/UsuariosView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/docentes',
          name: 'Docentes',
          component: () => import('../views/Admin/DocentesView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/estudiantes',
          name: 'Estudiantes',
          component: () => import('../views/Admin/EstudiantesView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/carreras',
          name: 'Carreras',
          component: () => import('../views/Admin/CarrerasView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/ciclos',
          name: 'Ciclos',
          component: () => import('../views/Admin/CiclosView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/preguntas',
          name: 'Preguntas',
          component: () => import('../views/Admin/PreguntasView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/catalogos',
          name: 'CatalogoPreguntas',
          component: () => import('../views/Admin/CatalogoPreguntasView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/resultados',
          name: 'Resultados',
          component: () => import('../views/Admin/ResultadoEntrevistasView.vue'),
          meta: { requiresAuth: true, canAccess: ['ADMIN'] }
        },
        {
          path: '/entrevistas',
          name: 'Entrevistas',
          component: () => import('../views/Docente/EntrevistasView.vue'),
          meta: { requiresAuth: true, canAccess: ['DOCENTE'] }
        },
        {
          path: '/evaluacion',
          name: 'EstudianteEvaluacion',
          component: () => import('../views/Docente/EvaluacionView.vue'),
          meta: { requiresAuth: true, canAccess: ['DOCENTE'] }
        }
      ]
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: Forbidden
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    const perfil = computed(() => authStore.user?.perfil || 'GUEST')    

    if (to.name === 'Login' && authStore.isAuthenticated()) {   
      return next({ name: 'Dashboard' })
    }

    if (!to.meta.requiresAuth) {
      return next()
    }

    if (!authStore.isAuthenticated()) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    if (
      to.meta.canAccess &&
      Array.isArray(to.meta.canAccess) &&
      !to.meta.canAccess.includes(perfil.value)
    ) {
      return next({ name: 'Forbidden' })
    }

    next()
  }
)

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ModificarRol from '../views/ModificarRol.vue'
import CrearRol from '../views/CrearRol.vue'
import RegistroRol from '../views/RegistroRol.vue'  
import CrearUsuario from '../views/CrearUsuario.vue'
import Login from '../views/Login.vue'
import usuariosRegistrados from '../views/usuariosRegistrados.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },

    {
      path: '/crearRol',
      name: 'crearRol',
      component: CrearRol
    },
    {
      path: '/registroRol',
      name: 'registroRol',
      component: RegistroRol

    },
    {
      path: '/modificarRol',
      name: 'modificarRol',
      component: ModificarRol
    },
    {
      path: '/crearUsuario',
      name: 'crearUsuario',
      component: CrearUsuario
    }
  ]
})

export default router

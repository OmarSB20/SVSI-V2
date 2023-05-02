import { createRouter, createWebHistory } from 'vue-router'
import { loginStore } from "../stores/login";

import HomeView from '../views/HomeView.vue'
import Roles from '../views/Roles.vue'
import CrearRol from '../views/CrearRol.vue'
import ActualizarRol from '../views/ActualizarRol.vue'
import CrearUsuario from '../views/CrearUsuario.vue'
import login from '../views/Login.vue'
import Usuarios from '../views/Usuarios.vue'
import ActualizarUsuario from '../views/ActualizarUsuario.vue'
import MediosContacto from '../views/MediosContacto.vue'
import Asesores from '../views/Asesores.vue'


//const { reanudarSesion } = loginStore();
//const reanudarSesion = loginStore();
//const {verificarPermisos} = loginStore();


const interfaces = {
  home: '0',
  login: '0',
  mediosContacto: '3',
  asesores: '5',
  crearUsuario: '9',
  usuarios: '9',
  actualizarUsuario: '9',
  crearRol: '14',
  actualizarRol: '14',
  roles: '14',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/italika',
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
      path: '/actualizarRol',
      name: 'actualizarRol',
      component: ActualizarRol
      
    },
    {
      path: '/roles',
      name: 'roles',
      component: Roles
      
    },
    {
      path: '/crearUsuario',
      name: 'crearUsuario',
      component: CrearUsuario
      
    },
    {
      path: '/login',
      name: 'login',
      component: login
      
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: Usuarios
      
    },
    {
      path: '/actualizarUsuario',
      name: 'actualizarUsuario',
      component: ActualizarUsuario
      
    },
    {
      path: '/mediosContacto',
      name: 'mediosContacto',
      component: MediosContacto
      
    },
    {
      path: '/asesores',
      name: 'asesores',
      component: Asesores
      
    }
  ]
})

router.beforeEach(async (to, from) => {

  const store = loginStore();
  if (await store.reanudarSesion()) {
    console.log("inciado");
    if (to.name == 'login') {
      return { name: 'home' }
    }

    const nombreInterfaz = to.name;
    const idInterfaz = interfaces[nombreInterfaz];

    if (await store.verificarPermisos(idInterfaz)) {
      return true
    } else {
      return { name: 'home' }
    }


    //En caso de no tener una sesión
  } else {
    console.log("no iniciado")
    if (from.name == 'login') {
      return false
    } else
      if (from.name != 'login' && to.name != 'login') {
        return { name: 'login' }
      }

    return true


  }

})


export default router
/*
 const nombreInterfaz = to.name;
    const idInterfaz = interfaces[nombreInterfaz];

    if (await store.verificarPermisos(idInterfaz)) {}

*/
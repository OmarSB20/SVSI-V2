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
import Creditos from '../views/Creditos.vue'
import Asesores from '../views/Asesores.vue'
import CrearCliente from '../views/CrearCliente.vue'
import Clientes from '../views/Clientes.vue'
import ActualizarCliente from '../views/ActualizarCliente.vue'
import CrearProspecto from '../views/CrearProspecto.vue';
import Prospectos from '../views/Prospectos.vue';
import ActualizarProspecto from '../views/ActualizarProspecto.vue';
import SeleccionCliente from '../views/SeleccionCliente.vue'
import EstatusCotizacion from '../views/EstatusCotizacion.vue'
import Cotizaciones from '../views/Cotizaciones.vue'

import  Servicios from '../views/servicios.vue'
import CrearServicio from '../views/CrearServicio.vue'
import ActualizarServicio from '../views/ActualizarServicio.vue'



//const { reanudarSesion } = loginStore();
//const reanudarSesion = loginStore();
//const {verificarPermisos} = loginStore();
import Catalogo from '../views/Catalogo.vue'

const interfaces = {
  home: '0',
  login: '0',
  seleccionCliente: '1',
  crearProspecto: '1',
  prospectos:'1',
  actualizarProspecto:'1',
  cotizaciones:"2",
  mediosContacto: '3',
  asesores: '5',
  estatusCotizacion:'6',
  creditos:'7',
  crearUsuario: '9',
  usuarios: '9',
  actualizarUsuario: '9',
  crearCliente: '10',
  clientes: '10',
  actualizarCliente:'10',
  catalogo:'11',
  crearRol: '14',
  actualizarRol: '14',
  roles: '14',
  crearServicio:'8',
  actualizarServicio:'8',
  servicios: '8',

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
      path: '/creditos',
      name: 'creditos',
      component: Creditos
      
    },
    {
      path: '/asesores',
      name: 'asesores',
      component: Asesores
      
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: Catalogo
      
    },
    {
      path: '/crearCliente',
      name: 'crearCliente',
      component: CrearCliente
      
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Clientes
      
    },
    {
      path: '/actualizarCliente',
      name: 'actualizarCliente',
      component: ActualizarCliente
      
    },
    {
      path: '/crearProspecto',
      name: 'crearProspecto',
      component: CrearProspecto
      
    },
    {
      path: '/prospectos',
      name: 'prospectos',
      component: Prospectos
      
    },
    {
      path: '/actualizarProspecto',
      name: 'actualizarProspecto',
      component: ActualizarProspecto
      
    },
    {
      path: '/seleccionCliente',
      name: 'seleccionCliente',
      component: SeleccionCliente
      
    },
    {
      path: '/estatusCotizacion',
      name: 'estatusCotizacion',
      component: EstatusCotizacion
      
    },
    {
      path: '/cotizaciones',
      name: 'cotizaciones',
      component: Cotizaciones
      
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: Servicios
      
    },

    {
      path: '/crearServicio',
      name: 'crearServicio',
      component: CrearServicio
      
    },

    {
      path: '/actualizarServicio',
      name: 'actualizarServicio',
      component: ActualizarServicio
      
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
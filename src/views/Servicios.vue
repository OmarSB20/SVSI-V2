<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import {watch} from 'vue';
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { usuariosStore } from "../stores/usuarios";
import { rolesStore } from "../stores/roles";
import { loginStore } from "../stores/login";
import CompHeader from "../components/Header.vue";

import { serviciosStore } from "../stores/servicios";
import { motosTallerStore } from "../stores/motosTaller";
import { estatusServicioStore } from "../stores/estatusServicio";
import { clientesStore } from "../stores/clientes";


//Metodos de la Store para Servicios

const {
  obtenerCliente,
  obtenerTodosClientes,
} = clientesStore();
const { obtenerIdPorUser } = usuariosStore();
const {agregarMotoTaller,consultarMotosTaller,obtenerUnaMotoTaller} = motosTallerStore();
const { getUser } = loginStore();
const { servicioExiste, agregarServicio,obtenerServicio, obtenerServicios,setIdServicios,actualizarServicio,consultarServiciosActivas } = serviciosStore();
const {obtenerEstatusServicioN,obtenerNombresEstatusServicio, agregarEstatusServicio} = estatusServicioStore();
const {obtenerEstatusServicios} = estatusServicioStore();


import router from "../router";
//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene

const { setIdUsuario } = usuariosStore();
const { agregarUsuario } = usuariosStore();
const { obtenerRoles } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();
const { actualizarUsuario } = usuariosStore();
const { getIdUsuario } = usuariosStore();
const { reanudarSesion } = loginStore();
const {verificarPermisos} = loginStore();
//variables reactivas
const usuarios = ref({});
const deshabilitado = ref(true);
//para buscar
const serviciosFiltrados = ref({});
const valorBusqueda = ref("");


const unnombreServicio= ref("");
const nombreServicioAct= ref("");
const idServicioAct= ref("");

const arrayServicios =ref([]);
const clientes=ref("");
const servicios=ref([]);
const estatusServicio=ref("");
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  
   // await consultarServicios();
    await consultarClientes();
    //await consultarServicios()
    await traerServiciosTabla();


    deshabilitado.value = true;
    modal = new bootstrap.Modal(document.getElementById("modal"), {
      keyboard: false,

  });
  
});

const consultarClientes = async () => {
  try {
    clientes.value = await obtenerTodosClientes();
    clientes.value = clientes.value.data.body;
    console.log(clientes.value);
  } catch (error) {
    console.log(error);
  }
};

const servicio=ref({});

const traerServiciosTabla = async () => {
  
    console.log("SERVICIOS TABLA")
    servicios.value = await obtenerServicios();
    servicios.value = servicios.value.data.body;
    console.log(servicios.value)

  for(var j=0; j<servicios.value.length; j++){
    console.log("kdmkfk");
    var clienteServicio = await obtenerCliente(servicios.value[j].Clientes_idClientes);
    var estatusSerServicio = await obtenerEstatusServicioN(servicios.value[j].EstatusServicio_idEstatusServicio);
    var motoTallerServicio = await obtenerUnaMotoTaller(servicios.value[j].MotosTaller_idMotosTaller);
  
    clienteServicio= await clienteServicio.data.body[0]; 
    estatusSerServicio = await estatusSerServicio.data.body[0];
    motoTallerServicio = await motoTallerServicio.data.body[0];
    console.log(clienteServicio.Clientes_idClientes);
    console.log(estatusSerServicio);
    console.log(motoTallerServicio);

    servicio.value=await {
      idServicios: servicios.value[j].idServicios,
      idCliente: clienteServicio.idClientes,
      NombreCliente:clienteServicio.Nombre,
      PaternoCliente: clienteServicio.Apellido_Paterno,
      MaternoCliente: clienteServicio.Apellido_Materno,
      Telefono: clienteServicio.Telefono,
      Correo: clienteServicio.Correo, 
      idMotoTaller: motoTallerServicio.idMotosTaller,
      NoSerie: motoTallerServicio.NoSerie,
      Modelo: motoTallerServicio.Modelo,
      EstatusSer:estatusSerServicio.idEstatusServicio,
      Descripcion:estatusSerServicio.Descripcion,
      EstActSer:estatusSerServicio.idEstatusActividad,
      Importe: servicios.value[j].Importe,
      Comentario: servicios.value[j].Descripcion,
      Kilometraje:servicios.value[j].Kilometraje,
     // CantidadServicio:servicios.value[j].cantidadServicio,
      FechaRegistro:new Date(servicios.value[j].FechaRegistro).toLocaleDateString(),
      CFechaEntrega:new Date(servicios.value[j].FechaEntrega).toLocaleDateString()
    };

    console.log(servicio.value);
    arrayServicios.value.push(servicio.value);
    
  }
filtrarServicios(); // Filtrar los servicios inicialmente
  console.log(arrayServicios.value);
  
};

// function myFunction() {
//   var input, filter, table, tr, td, i, txtValue;
//   input = document.getElementById("myInput");
//   filter = input.value.toUpperCase();
//   table = document.getElementById("myTable");
//   tr = table.getElementsByTagName("tr");
//   for (i = 0; i < tr.length; i++) {
//     td = tr[i].getElementsByTagName("td")[0];
//     if (td) {
//       txtValue = td.textContent || td.innerText;
//       if (txtValue.toUpperCase().indexOf(filter) > -1) {
//         tr[i].style.display = "";
//       } else {
//         tr[i].style.display = "none";
//       }
//     }
//   }
// }

function modificarServicio(idServicios) {
  console.log(idServicios);
  setIdServicios(idServicios); //guardar el ide en el store
  //mandar a otra interfaz
  console.log("HOLA");
  router.push({ name: "actualizarServicio"});
}
function confirmar(idEmpleados) {
  idempleadoEliminar.value = idEmpleados;
  modalConfirmacion.show();

}

function mostrarmodal(unnombreServicio) {
  nombreServicioAct.value = unnombreServicio;
  modal.show();
  console.log(nombreServicioAct.value);
}

async function desactivarServicio(nombreServicioAct) {
  console.log(nombreServicioAct);
  const servicioActualizar = {
    idServicios: nombreServicioAct,
    idEstatusActividad: 2,
  };
    try {
    await actualizarServicio(servicioActualizar);
    const index = serviciosFiltrados.value.findIndex(
      (servicio) => servicio.idServicios === nombreServicioAct
    );
    if (index > -1) {
      serviciosFiltrados.value.splice(index, 1);
    }
    
  } catch (error) {
    console.log(error);
  }
//  consultarUsuarios();
}

//const valorBusqueda= ref("");

const filtrarServicios = () => {
  const valor = valorBusqueda.value.toLowerCase().trim(); // Obtener el valor de búsqueda en minúsculas y sin espacios en blanco
  const terminos = valor.split(' '); // Separar los términos de búsqueda

  serviciosFiltrados.value = arrayServicios.value.filter((servicio) => {
    // Filtrar los servicios según los términos de búsqueda
    return terminos.some((termino) => {
      const nombreCliente = servicio.NombreCliente.toLowerCase();
      const apellidoCliente = servicio.PaternoCliente.toLowerCase();
      const apellidomatCliente = servicio.MaternoCliente.toLowerCase();
      const modelo = servicio.Modelo.toLowerCase();
      const estatus = servicio.Descripcion.toLowerCase();
      const nomSerie = servicio.NoSerie.toLowerCase();
      const corre = servicio.Correo.toLowerCase();
    // const modelo = servicio.Modelo.toLowerCase();
    // const kilometraje = servicio.Kilometraje;
    // const importe = servicio.Importe;
    // const cantiSer = servicio.CantidadServicio;
    // const fere = servicio.FechaRegistro;
    // const feen = servicio.FechaEntrega;
    // const desc = servicio.Comentario.toLowerCase();
      return (
        nombreCliente.includes(termino) ||
        apellidoCliente.includes(termino) ||
        apellidomatCliente.includes(termino) ||
        modelo.includes(termino) ||
        estatus.includes(termino) ||
        nomSerie.includes(termino) ||
        corre.includes(termino) 
      );
    });
  });
};


watch(valorBusqueda, () => {
  filtrarServicios();
});

</script>
<template>
  <div class="container-fluid">
    <CompHeader />

    <div class="row">
      <div class="col-1 mb-3 pt-5 d-flex justify-content-end">
        <router-link to="/italika">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Servicios</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika d-flex justify-content-start">Servicios registrados</h5>
        </div>
      </div>
      <div class="col-3 align-items-end">
        <div class="row align-items-end pt-2">
          <input
            id="myInput"
    v-model="valorBusqueda"
    type="text"
    class="form-control rounded-pill mt-4"
    style="width: 250px; height: 50px; border-color: #5e5e5e"
    placeholder="Buscar"
          />
        </div>
        <div class="row">
          <div class="col-7">
            <h5 class="italika mt-3 d-flex justify-content-end">Agregar Servicios</h5>
          </div>

          <div class="col">
            <router-link to="../crearServicio" style="text-decoration: none">
              <button
                class="btn btn-primary btn-create mt-2 d-flex align-items-center justify-content-center"
                type="button"
                style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;
                "
              >
                <h4>+</h4>
              </button>
            </router-link>
          </div>
          <div class="col-3"></div>
        </div>
      </div>
    </div>
    <div class="table-responsive-sm">
      <table
        id="myTable"
        class="table table-hover table-striped text-center mt-4 mx-auto"
        style="width: 950px; overflow-x: scroll"
      >
        <thead>
          <tr style="background-color: #2b4677; color: white; vertical-align: middle">
            <th scope="col">Nombre</th>
            <th scope="col">Apellido paterno</th>
            <th scope="col">Apellido materno</th>
            <th scope="col">Correo electronico</th>
            <th scope="col">Telefono</th>
            <th scope="col">Estatus de Servicio</th>
            <th scope="col">No Serie</th>
            <th scope="col">Modelo</th>
            <th scope="col">Kilometraje</th>
            <th scope="col">Importe</th>
            <!-- <th scope="col">Capacidad</th> -->
            <th scope="col">Fecha de Registro</th>
            <th scope="col">Fecha de Ingreso</th>
            <th scope="col">Comentario</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <th scope="col" class="sticky" style="position: sticky; right: 0">
              Opciones
            </th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in serviciosFiltrados" :key="servicio.idServicios" v-if="servicio.EstActSer !== 2">
            <td>{{ servicio.NombreCliente }}</td>
            <td>{{ servicio.PaternoCliente }}</td>
            <td>{{ servicio.MaternoCliente }}</td>
            <td>{{ servicio.Correo }}</td>
            <td>{{ servicio.Telefono }}</td>
            <td>{{ servicio.Descripcion }}</td>
            <td>{{ servicio.NoSerie }}</td>
            <td>{{ servicio.Modelo }}</td>
            <td>{{ servicio.Kilometraje }}</td>
            <td>{{ servicio.Importe }}</td>
            <!-- <td>{{ servicio.CantidadServicio }}</td> -->
            <td>{{ servicio.FechaRegistro }}</td>
            <td>{{ servicio.CFechaEntrega }}</td>
            <td>{{ servicio.Comentario  }}</td>
            <td scope="row" class="sticky" style="position: sticky">
              <div class="container">
                <div class="d-inline-flex">
                  <button
                    class="btn btn-primary d-inline-block mr-3 btn-spacer"
                    type="submit"
                    style="
                      background-color: #ffbe16;
                      border-color: #ffbe16;
                      height: 37px;
                      width: 45px;
                    "
                    @click="modificarServicio(servicio.idServicios)"
                  >
                    <i
                  class="fa-solid fa-pen-to-square"
                  style="color: black;"
                ></i>
                  </button>
                  <button
                    class="btn btn-primary btn-delete d-inline-block"
                    type="submit"
                    style="
                      background-color: #c01a1a;
                      border-color: #c01a1a;
                      height: 37px;
                      width: 45px;
                      margin-top: 0% !important;
                    "
                    @click="mostrarmodal( servicio.idServicios)"
                  >
                    <img
                      class="img-fluid mb-1"
                      style="width: 24.5px; height: 22.75px; margin-top: 0% !important"
                      src="../assets/basura.png"
                    />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    class="modal fade"
    id="modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Servicio</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span
            >¿Está seguro de que quiere eliminar este Servicio?</span
          >
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="desactivarServicio(nombreServicioAct)"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);
  min-height: 100vh;
}
.btn-spacer {
  margin-right: 10px;
}
.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
}
#myInput {
  background-repeat: no-repeat;
}
.table-striped tbody tr .sticky {
  background-color: white;
}
.table-striped tbody tr:nth-child(2n) .sticky {
  background-color: inherit;
}
.table-striped tbody th .sticky {
  background-color: #2b4677;
  color: white;
}
#myTable th {
  background-color: #2b4677;
  color: white;
}
#myTable .sticky {
  border-collapse: collapse;
  position: sticky;
  right: 0%;
}
#myTable th,
#myTable td {
  text-align: center;
  padding: 12px;
}
#myTable tr {
  border-bottom: 1px solid #ddd;
}
#myTable tr.header,
#myTable tr:hover {
  background-color: #f1f1f1;
}
.table-container {
  max-width: 100%;
  overflow-x: scroll;
}
</style>
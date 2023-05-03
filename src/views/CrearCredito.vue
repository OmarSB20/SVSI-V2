<script setup>
import { ref } from "vue";
//import { permisosRolesStore } from "../stores/permisosRoles";
//import { rolesStore } from "../stores/roles";
import { onMounted } from "vue";
import router from '../router/index'
import { creditosStore } from '../stores/creditos'

import CompHeader from '../components/Header.vue'

// const { obtenerPermisosDelRol } = permisosRolesStore();
// const { eliminarPermisosDelRol } = permisosRolesStore();
// const { obtenerRoles } = rolesStore();
// const { eliminarRol } = rolesStore();
const { setCredito } = creditosStore();
const { obtenerCredito, agregarCredito, actualizarCredito } = creditosStore();



const rolDir = ref({});
const buscador = ref({});
const roles = ref([]);
const creditoArray = ref([]);
const creditosDesplegados = ref([]);
const permisosDeRolArray = ref([]);
const idRolEliminar = ref();
const creditoNuevo = ref("");
const repetido = ref(false);
const deshabilitado = ref(false);
const botonActualizar = ref(false);
const idBotonActualizar = ref(0);
const botonRegresar = ref(false);

var modal1;
var modalConfirmacion;
var nombre;

onMounted(() => {
  consultarCredito();
  modal1 = new bootstrap.Modal(document.getElementById("modal1"), {
    keyboard: false,
  });


});

const consultarCredito = async () => {
  try {
    const credito = await obtenerCredito()
    console.log(credito.data.body)
    creditoArray.value = credito.data.body //guardo tofo
    creditosDesplegados.value = credito.data.body //filtrado

  } catch (error) {
    console.log(error)
  }


}
// const consultarRoles = async () => {
//   buscador.value = [];
//   rolesArray.value = [];
//   rolDir.value = [];
//   try {
//     roles.value = await obtenerRoles();
//     const body = roles.value.data.body;
//     console.log(roles.value);
//     for (var j in body) {
//       rolesArray.value.push(body[j]);
//       buscador.value.push(body[j].Nombre);
//       rolDir.value.push(body[j].idRoles);
//     }
//     rolesDesplegados.value = rolesArray.value;
//   } catch (error) {
//     console.log(error);
//   }
// };


const eliminarRoles = async (idEmpleados) => {
  try {
    await eliminarPermisosDelRol(idEmpleados);
    await eliminarRol(idEmpleados);
    await consultarRoles();
  } catch (error) {
    console.log(error);
  }
};

function modificarNombreCredito(Descripcion, idTipos_De_Creditos) {
  creditoNuevo.value = Descripcion
  idBotonActualizar.value = idTipos_De_Creditos
  if (!botonActualizar.value) {
    botonActualizar.value = true;
  }

  else {
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    creditoNuevo.value = "";
  }

}

async function guardarCreditos(Descripcion) {
  try {
    console.log(Descripcion);
    await agregarCredito(Descripcion);
    creditoNuevo.value = ""

    modal1.show();
    this.consultarCredito();

  } catch (error) {
    console.log(error)
  }

}

async function modificarCreditos(idTipos_De_Creditos, Descripcion, idEstatusActividad) {
  try {
    await actualizarCredito(idTipos_De_Creditos, Descripcion, idEstatusActividad);
    creditoNuevo.value = ""
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    this.consultarCredito();
  } catch (error) {
    console.log(error)
  }
}

function actualizarTabla(nombre) {
  console.log(nombre)
  if (nombre.trim() == "") { //recorta los espacios
    creditosDesplegados.value = creditoArray.value;
  } else {
    creditosDesplegados.value = []; //inicializa vacio deja limpio
    creditoArray.value.forEach((element) => { //recorre el elemento
      if (element.Descripcion.toLowerCase().includes(nombre.toLowerCase())) { //checa si  coincide
        creditosDesplegados.value.push(element); //aqui lo va a grefgar a creditosDesplegaados
      }
    });
  }
}

function confirmar(idRol) {
  idRolEliminar.value = idRol;
  modalConfirmacion.show();
}


const revisarCreditoExistente = async () => {
  if (creditoNuevo.value.trim() == "") {
    deshabilitado.value = true;
    return;
  }
  try {
    for (var j in creditoArray.value) {
      if (
        creditoArray.value[j].Descripcion.toLowerCase() == creditoNuevo.value.trim().toLowerCase()
      ) {
        repetido.value = true;
        deshabilitado.value = true;
        return true;
      }
    }
    repetido.value = false;
    deshabilitado.value = false;
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

</script>
<template>
  <div class="container-fluid">
    <CompHeader />
    <div class="row">
      <div class="col-1 mb-3 pt-5">
        <router-link to="http://localhost:5173">
          <img class="img-fluid mt-3" style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png" />
        </router-link>
      </div>
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Tipos de Créditos</p>

        </div>


        <!-- cambiar el tamaño a 5 si lo quiero mas lejos de la tabla -->

      </div>
      <div class="col-3 align-items-end ">
        <div class="row align-items-end pt-2">
          <input type="text" class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e" placeholder="Buscar" v-model="nombre"
            @input="actualizarTabla(nombre)" />
        </div>


      </div>
    </div>
    <div class="row mb-5">
      <div class="col-2 mt-2 ms-5">
        <h5 class="italika d-flex justify-content-end">Tipo de crédito:</h5>

      </div>
      <div class="col-6 ms-4">
        <input type="text" ref="inputRol" class="form-control" @input="revisarCreditoExistente()"
          v-model="creditoNuevo" />
        <div v-if="repetido" class="alert alert-danger mt-2 d-flex align-items-center" style="height: 38px" role="alert">
          "{{ creditoNuevo }}" ya existe
        </div>
      </div>
      <div class="col">
        <button v-if="!botonActualizar" class="btn btn-primary" type="submit" :disabled="deshabilitado"
          @click="guardarCreditos(creditoNuevo)">
          Guardar

        </button>

        <button v-if="botonActualizar" class="btn btn-success" type="submit" :disabled="deshabilitado"
          @click="modificarCreditos(idBotonActualizar, creditoNuevo)">
          Actualizar

        </button>
      </div>
    </div>
    <table class="table table-hover table-striped text-center mt-4 mx-auto" style="width: 900px">
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Tipo de Crédito</th>
          <th scope="col" style="width: 200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="credito in creditosDesplegados ">

          <td>
            {{ credito.Descripcion }}
          </td>
          <th scope="row">
            <div class="align-items-center">
              <!-- <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #59c01a; border-color: #59c01a; height: 37px"
                @click="consultarPermisosDeRol(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 28.5px; height: 18.75px; margin-top: 0% !important"
                  src="../assets/eyeWhite.png"
                />
              </button> -->

              <button :id="credito.idTipos_De_Creditos"
                :class="[botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos ? 'btn btn-primary mx-1' : 'btn btn-warning mx-1']"
                type="submit" style="border-color: #ffbe16; height: 37px"
                @click="modificarNombreCredito(credito.Descripcion, credito.idTipos_De_Creditos)">
                <i
                  :class="[botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos ? 'fa-solid fa-clock-rotate-left' : 'fa-solid fa-pen-to-square']"></i>

                <!-- <img class="img-fluid mb-3" style="width: 24.5px; height: 25.75px; margin-top: 0% !important"
                :src="[botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos ? 'https://cdn-icons-png.flaticon.com/512/3585/3585896.png' : 'SVSI-V2/src/assets/lapiz.png' ]"   /> -->
              </button>
              <button class="btn btn-primary mx-1" type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px" @click="confirmar(rol.idRoles)">
                <img class="img-fluid mb-1" style="width: 24.5px; height: 22.75px" src="../assets/basura.png" />
              </button>
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal  modalCon-->



  <div class="modal fade" id="modal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tipos de Creditos</h5>


          <button type="button" class="btn-close" data-bs-dismiss="modal1" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>Guardado exitosamente</h5>

        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modalCon" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Permisos del Rol</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar este permiso?</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="eliminarRoles(idRolEliminar)">
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

.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
}
</style>
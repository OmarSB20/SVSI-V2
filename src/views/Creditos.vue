<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import router from "../router/index";
import { creditosStore } from "../stores/creditos";

import CompHeader from "../components/Header.vue";

const {
  obtenerCredito,
  agregarCredito,
  actualizarCredito,
  obtenerNombresCreditos,
} = creditosStore();

const creditoArray = ref([]);
const creditosDesplegados = ref([]);
const creditoNuevo = ref("");
const repetido = ref(false);
const deshabilitado = ref(false);
const botonActualizar = ref(false);
const idBotonActualizar = ref(0);
const creditoAgregado = ref("");

const arrayNombres = ref([]);
const nombreActualizado = ref("");
const nombreAntiguo = ref("");
const idCredEl = ref("");
const nombreCreditEl = ref("");

var nombreActual;

const botonRegresar = ref(false);

var modal1;
var modalConfirmacion;
var nombre;

onMounted(async () => {
  revisarCreditoExistente();
  await consultarCredito();
});

const consultarNombres = async () => {
  arrayNombres.value = (await obtenerNombresCreditos()).data.body;
  console.log(arrayNombres.value);
};

const consultarCredito = async () => {
  try {
    await consultarNombres();
    const credito = await obtenerCredito();
    console.log(credito.data.body);
    creditoArray.value = credito.data.body; //guardo tofo
    creditosDesplegados.value = credito.data.body; //filtrado
  } catch (error) {
    console.log(error);
  }
};

function modificarNombreCredito(Descripcion, idTipos_De_Creditos) {
  creditoNuevo.value = Descripcion;

  idBotonActualizar.value = idTipos_De_Creditos;
  if (!botonActualizar.value) {
    nombreActual = Descripcion;
    console.log(nombreActual);
    botonActualizar.value = true;
  } else {
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    creditoNuevo.value = "";
    nombreActual = "";
    console.log(nombreActual);
  }
  repetido.value = false;
}

async function guardarCreditos(Descripcion) {
  try {
    console.log(Descripcion);
    await agregarCredito(Descripcion.trim());
    await consultarCredito();
    modal1 = new bootstrap.Modal(document.getElementById("modal1"), {
      keyboard: false,
    });
    modal1.show();
    creditoAgregado.value = creditoNuevo.value;
    console.log(creditoAgregado.value);
    creditoNuevo.value = "";
  } catch (error) {
    console.log(error);
  }
}

async function modificarCreditos(idTipos_De_Creditos, Descripcion) {
  try {
    nombreAntiguo.value = nombreActual;
    nombreActualizado.value = Descripcion;
    console.log(Descripcion + "Es el que recibira");
    console.log(nombreActual + "es el original");
    await actualizarCredito(idTipos_De_Creditos, Descripcion.trim(), 1);
    await consultarCredito();
    creditoNuevo.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    modal1 = new bootstrap.Modal(document.getElementById("modalAct"), {
      keyboard: false,
    });
    modal1.show();
    nombreActual = "";
  } catch (error) {
    console.log(error);
  }
}

function actualizarTabla(nombre) {
  console.log(nombre);
  if (nombre.trim() == "") {
    //recorta los espacios
    creditosDesplegados.value = creditoArray.value;
  } else {
    creditosDesplegados.value = []; //inicializa vacio deja limpio
    creditoArray.value.forEach((element) => {
      //recorre el elemento
      if (element.Descripcion.toLowerCase().includes(nombre.toLowerCase())) {
        //checa si  coincide
        creditosDesplegados.value.push(element); //aqui lo va a grefgar a creditosDesplegaados
      }
    });
  }
}

async function eliminarCredito() {
  try {
    await actualizarCredito(idCredEl.value, nombreCreditEl.value, 2);
    await consultarCredito();
    creditoNuevo.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
  } catch (error) {
    console.log(error);
  }
}

function mostrarModalEliminar(idTipos_De_Creditos, Descripcion) {
  idCredEl.value = idTipos_De_Creditos;
  nombreCreditEl.value = Descripcion;
  modal1 = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
  modal1.show();
}

const revisarCreditoExistente = () => {
  if (creditoNuevo.value.trim() == "" || creditoNuevo.value.trim() == nombreActual) {
    deshabilitado.value = true;
    return;
  }
  try {
    for (var j in arrayNombres.value) {
      if (
        arrayNombres.value[j].Descripcion.toLowerCase() ==
        creditoNuevo.value.trim().toLowerCase()
      ) {
        repetido.value = true;
        deshabilitado.value = true;
        console.log(creditoNuevo.value);
        console.log(arrayNombres.value[j].Descripcion);
        return true;
      }
    }
    console.log(repetido.value);
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
      <div class="col-1 d-flex justify-content-end pt-5">
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
          <p class="italika ms-4" style="font-size: 50px">Tipos de Créditos</p>
        </div>

        <!-- cambiar el tamaño a 5 si lo quiero mas lejos de la tabla -->
      </div>
      <div class="col-3 align-items-end">
        <div class="row align-items-end pt-2">
          <input
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
            v-model="nombre"
            @input="actualizarTabla(nombre)"
          />
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-2 mt-2 ms-5">
        <h5 class="italika d-flex justify-content-end">Tipo de crédito:</h5>
      </div>
      <div class="col-6 ms-4">
        <input
          type="text"
          ref="inputRol"
          class="form-control"
          @input="revisarCreditoExistente()"
          v-model="creditoNuevo"
        />
        <div
          v-if="repetido"
          class="alert alert-danger mt-2 d-flex align-items-center"
          style="height: 38px"
          role="alert"
        >
          "{{ creditoNuevo }}" ya existe
        </div>
      </div>
      <div class="col">
        <button
          v-if="!botonActualizar"
          class="btn btn-primary"
          type="submit"
          :disabled="deshabilitado"
          @click="guardarCreditos(creditoNuevo)"
        >
          Guardar
        </button>

        <button
          v-if="botonActualizar"
          class="btn btn-success"
          type="submit"
          :disabled="deshabilitado"
          @click="modificarCreditos(idBotonActualizar, creditoNuevo)"
        >
          Actualizar
        </button>
      </div>
    </div>
    <table
      class="table table-hover table-striped text-center mt-4 mx-auto"
      style="width: 900px"
    >
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Tipo de Crédito</th>
          <th scope="col" style="width: 200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="credito in creditosDesplegados">
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

              <button
                :id="credito.idTipos_De_Creditos"
                :class="[
                  botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos
                    ? 'btn btn-primary mx-1'
                    : 'btn btn-warning btn-spacer mx-1',
                ]"
                type="submit"
                style="border-color: #ffbe16; height: 37px"
                @click="
                  modificarNombreCredito(credito.Descripcion, credito.idTipos_De_Creditos)
                "
              >
                <i
                  :class="[
                    botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos
                      ? 'fa-solid fa-clock-rotate-left'
                      : 'fa-solid fa-pen-to-square',
                  ]"
                ></i>

                <!-- <img class="img-fluid mb-3" style="width: 24.5px; height: 25.75px; margin-top: 0% !important"
                :src="[botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos ? 'https://cdn-icons-png.flaticon.com/512/3585/3585896.png' : 'SVSI-V2/src/assets/lapiz.png' ]"   /> -->
              </button>

              <button
                class="btn btn-primary mx-1 btn-delete"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                @click="
                  mostrarModalEliminar(credito.idTipos_De_Creditos, credito.Descripcion)
                "
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 24.5px; height: 22.75px"
                  src="../assets/basura.png"
                />
              </button>
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal  modalCon-->

  <div
    class="modal fade"
    id="modal1"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tipos de Creditos</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal1"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>¡Crédito "{{ creditoAgregado }}" guardado exitosamente!</h5>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
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
          <h5 class="modal-title" id="exampleModalLabel">Elminar tipo de crédito</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span
            >¿Está seguro de que quiere eliminar el tipo de crédito "{{
              nombreCreditEl
            }}"?</span
          >
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="eliminarCredito()"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!---------------------------------------------------------------------------->
  <div
    class="modal fade"
    id="modalAct"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tipos de Creditos</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modalAct"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>
            ¡Crédito "{{ nombreAntiguo }}" actualizado a "{{ nombreActualizado }}" con
            exito!
          </h5>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cerrar
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

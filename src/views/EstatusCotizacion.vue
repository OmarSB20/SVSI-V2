<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import router from "../router/index";
import { estatusCotizacionStore } from "../stores/estatusCotizacion";

import CompHeader from "../components/Header.vue";

const {
  obtenerEstatusCotizacion,
  agregarEstatusCotizacion,
  actualizarEstatusCotizacion,
 obtenerNombresEstatusCotizacion,
} = estatusCotizacionStore();

const estCotArray = ref([]);
const estCotDesplegados = ref([]);
const estCotNuevo = ref("");
const repetido = ref(false);
const deshabilitado = ref(false);
const botonActualizar = ref(false);
const idBotonActualizar = ref(0);
const estCotAgregado = ref("");

const arrayNombres = ref([]);
const nombreActualizado = ref("");
const nombreAntiguo = ref("");
const idEstCotEl = ref("");
const nombreEstCotEl = ref("");

var nombreActual;

const botonRegresar = ref(false);

var modal1;
var modalConfirmacion;
var nombre;

onMounted(async () => {
  revisarEstCotExistente();
  await consultarEstCot();
});

const consultarNombres = async () => {
  arrayNombres.value = (await obtenerNombresEstatusCotizacion()).data.body;
  console.log(arrayNombres.value);
};

const consultarEstCot = async () => {
  try {
    await consultarNombres();
    const estCot = await obtenerEstatusCotizacion();
    console.log(estCot.data.body);
    estCotArray.value = estCot.data.body; //guardo tofo
    estCotDesplegados.value = estCot.data.body; //filtrado
  } catch (error) {
    console.log(error);
  }
};

function modificarNombreEstCot(Descripcion, idEstatusCotizacion) {
  estCotNuevo.value = Descripcion;

  idBotonActualizar.value = idEstatusCotizacion;
  if (!botonActualizar.value) {
    nombreActual = Descripcion;
    console.log(nombreActual);
    botonActualizar.value = true;
  } else {
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    estCotNuevo.value = "";
    nombreActual = "";
    console.log(nombreActual);
  }
  repetido.value = false;
}

async function guardarEstCot(Descripcion) {
  try {
    console.log(Descripcion);
    await agregarEstatusCotizacion(Descripcion);
    await consultarEstCot();
    modal1 = new bootstrap.Modal(document.getElementById("modal1"), {
      keyboard: false,
    });
    modal1.show();
    estCotAgregado.value = estCotNuevo.value;
    console.log(estCotAgregado.value);
    estCotNuevo.value = "";
  } catch (error) {
    console.log(error);
  }
}

async function modificarEstCot(idEstatusCotizacion, Descripcion) {
  try {
    nombreAntiguo.value = nombreActual;
    nombreActualizado.value = Descripcion;
    console.log(Descripcion + "Es el que recibira");
    console.log(nombreActual + "es el original");
    await actualizarEstatusCotizacion(idEstatusCotizacion, Descripcion.trim(), 1);
    await consultarEstCot();
    estCotNuevo.value = "";
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
    estCotDesplegados.value = estCotArray.value;
  } else {
    estCotDesplegados.value = []; //inicializa vacio deja limpio
    estCotArray.value.forEach((element) => {
      //recorre el elemento
      if (element.Descripcion.trim().toLowerCase().includes(nombre.trim().toLowerCase())) {
        //checa si  coincide
        estCotDesplegados.value.push(element); //aqui lo va a grefgar a creditosDesplegaados
      }
    });
  }
}

async function eliminarEstCot() {
  try {
    await actualizarEstatusCotizacion(idEstCotEl.value, nombreEstCotEl.value, 2);
    await consultarEstCot();
    estCotNuevo.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
  } catch (error) {
    console.log(error);
  }
}

function mostrarModalEliminar(idEstatusCotizacion, Descripcion) {
  idEstCotEl.value = idEstatusCotizacion;
  nombreEstCotEl.value = Descripcion;
  modal1 = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
  modal1.show();
}

const revisarEstCotExistente = () => {
  if (estCotNuevo.value.trim() == "" || estCotNuevo.value.trim() == nombreActual) {
    deshabilitado.value = true;
    return;
  }
  try {
    for (var j in arrayNombres.value) {
      if (
        arrayNombres.value[j].Descripcion.toLowerCase() ==
        estCotNuevo.value.trim().toLowerCase()
      ) {
        repetido.value = true;
        deshabilitado.value = true;
        console.log(estCotNuevo.value);
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
          <p class="italika ms-4" style="font-size: 50px">Estatus de cotización</p>
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
        <h5 class="italika d-flex justify-content-end">Nombre del estatus:</h5>
      </div>
      <div class="col-6 ms-4">
        <input
          type="text"
          ref="inputRol"
          class="form-control"
          @input="revisarEstCotExistente()"
          v-model="estCotNuevo"
        />
        <div
          v-if="repetido"
          class="alert alert-danger mt-2 d-flex align-items-center"
          style="height: 38px"
          role="alert"
        >
          "{{ estCotNuevo }}" ya existe
        </div>
      </div>
      <div class="col">
        <button
          v-if="!botonActualizar"
          class="btn btn-primary"
          type="submit"
          :disabled="deshabilitado"
          @click="guardarEstCot(estCotNuevo)"
        >
          Guardar
        </button>

        <button
          v-if="botonActualizar"
          class="btn btn-success"
          type="submit"
          :disabled="deshabilitado"
          @click="modificarEstCot(idBotonActualizar, estCotNuevo)"
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
          <th scope="col">Estatus</th>
          <th scope="col" style="width: 200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="estCot in estCotDesplegados">
          <td>
            {{ estCot.Descripcion }}
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
                :id="estCot.idEstatusCotizacion"
                :class="[
                  botonActualizar && idBotonActualizar == estCot.idEstatusCotizacion
                    ? 'btn btn-primary mx-1'
                    : 'btn btn-warning mx-1',
                ]"
                type="submit"
                style="border-color: #ffbe16; height: 37px"
                @click="
                  modificarNombreEstCot(estCot.Descripcion, estCot.idEstatusCotizacion)
                "
              >
                <i
                  :class="[
                    botonActualizar && idBotonActualizar == estCot.idEstatusCotizacion
                      ? 'fa-solid fa-clock-rotate-left'
                      : 'fa-solid fa-pen-to-square',
                  ]"
                ></i>

                <!-- <img class="img-fluid mb-3" style="width: 24.5px; height: 25.75px; margin-top: 0% !important"
                :src="[botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos ? 'https://cdn-icons-png.flaticon.com/512/3585/3585896.png' : 'SVSI-V2/src/assets/lapiz.png' ]"   /> -->
              </button>

              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                @click="
                  mostrarModalEliminar(estCot.idEstatusCotizacion, estCot.Descripcion)
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
          <h5 class="modal-title" id="exampleModalLabel">Estatus de cotización</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal1"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>¡Estatus de cotización "{{ estCotAgregado }}" guardado exitosamente!</h5>
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
          <h5 class="modal-title" id="exampleModalLabel">Elminar estatus de cotización</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span
            >¿Está seguro de que quiere eliminar el estatus de cotizacion "{{
              nombreEstCotEl
            }}"?</span
          >
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="eliminarEstCot()"
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
          <h5 class="modal-title" id="exampleModalLabel">Estatus de cotización</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modalAct"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>
            ¡Estatus de cotización "{{ nombreAntiguo }}" actualizado a "{{ nombreActualizado }}" con
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

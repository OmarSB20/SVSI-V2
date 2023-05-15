<script setup>
import { ref } from "vue";
import { asesoresStore } from "../stores/asesores";
import { onMounted } from "vue";
import router from "../router";
import CompHeader from "../components/Header.vue";

const { agregarAsesor } = asesoresStore();
const { actualizarAsesor } = asesoresStore();
const { obtenerAsesoresActivos } = asesoresStore();
const { obtenerTodos } = asesoresStore();
const { eliminarAsesor } = asesoresStore();

const asesores = ref({});
const nombre = ref("");
const apellidoMaterno = ref("");
const apellidoPaterno = ref("");
const asesoresFiltrados = ref({});
const asesoresTabla = ref([]);

const nombreNuevo = ref("");
const paternoNuevo = ref("");
const maternoNuevo = ref("");
const nombreAntiguo = ref("");
const paternoAntiguo = ref("");
const maternoAntiguo = ref("");
const nombreActualizado = ref("");
const paternoActualizado = ref("");
const maternoActualizado = ref("");
const busqueda = ref("");
const asesorEliminar = ref(null);
const todos = ref("");

const repetido = ref(false);
const deshabilitado = ref(false);
const botonActualizar = ref(false);
const idBotonActualizar = ref(-1);

const asesor = ref(null);

var modal1;
var modal;

onMounted(() => {
  consultarAsesores();
  revisarAsesorExistente();
  traerTodos();
});

const crearAsesor = async () => {
  try {
    const asesorNuevo = {
      idAsesoresBAZ: 0,
      EstatusActividad_idEstatusActividad: 1,
      Nombre: nombre.value,
      Apellido_Paterno: apellidoPaterno.value,
      Apellido_Materno: apellidoMaterno.value,
    };
    await agregarAsesor(asesorNuevo);
    // await consultarAsesores();
    asesoresTabla.value = asesores.value;
    modal1 = new bootstrap.Modal(document.getElementById("modal1"), {
      keyboard: false,
    });
    modal1.show();
    console.log(asesoresTabla.value);
    nombre.value = "";
    apellidoMaterno.value = "";
    apellidoPaterno.value = "";
    consultarAsesores();
  } catch (error) {
    console.log(error);
  }
};

const consultarAsesores = async () => {
  try {
    const asesoresArray = (await obtenerAsesoresActivos()).data.body;
    console.log(asesoresArray);
    asesores.value = asesoresArray;
    asesoresFiltrados.value = asesores.value;
    asesoresTabla.value = asesores.value; // update asesoresTabla here
  } catch (error) {
    console.log(error);
  }
};

function seleccionarAsesor(idAsesoresBAZ, Nombre, Apellido_Materno, Apellido_Paterno) {
  nombreNuevo.value = Nombre;
  paternoNuevo.value = Apellido_Paterno;
  maternoNuevo.value = Apellido_Materno;
  console.log(nombreNuevo.value);
  console.log(paternoNuevo.value);
  console.log(maternoNuevo.value);

  idBotonActualizar.value = idAsesoresBAZ;
  if (!botonActualizar.value) {
    nombre.value = Nombre;
    apellidoPaterno.value = Apellido_Paterno;
    apellidoMaterno.value = Apellido_Materno;
    botonActualizar.value = true;
  } else {
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    nombre.value = "";
    apellidoPaterno.value = "";
    apellidoMaterno.value = "";
  }
  repetido.value = false;
  revisarAsesorExistente();
}

async function modificarAsesor(
  idAsesoresBAZ,
  Nombre,
  Apellido_Materno,
  Apellido_Paterno
) {
  try {
    nombreAntiguo.value = nombreNuevo.value;
    paternoAntiguo.value = paternoNuevo.value;
    maternoAntiguo.value = maternoNuevo.value;
    nombreActualizado.value = Nombre;
    paternoActualizado.value = Apellido_Paterno;
    maternoActualizado.value = Apellido_Materno;
    asesor.value = {
      idAsesoresBAZ: idAsesoresBAZ,
      EstatusActividad_idEstatusActividad: 1,
      Nombre: Nombre,
      Apellido_Paterno: Apellido_Paterno,
      Apellido_Materno: Apellido_Materno,
    };
    modal1 = new bootstrap.Modal(document.getElementById("modal1"), {
      keyboard: false,
    });
    modal1.show();

    await actualizarAsesor(asesor.value);
    await consultarAsesores();
    nombre.value = "";
    apellidoPaterno.value = "";
    apellidoMaterno.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    nombreNuevo.value = "";
    paternoNuevo.value = "";
    maternoNuevo.value = "";
  } catch (error) {
    console.log(error);
  }
}

async function borrarAsesor(idAsesoresBAZ) {
  console.log(idAsesoresBAZ);
  asesorEliminar.value = {
    idAsesoresBAZ: idAsesoresBAZ,
    EstatusActividad_idEstatusActividad: 2,
  };
  try {
    mostrarModalEliminar();
    nombre.value = "";
    apellidoPaterno.value = "";
    apellidoMaterno.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    repetido = false;
  } catch (error) {
    console.log(error);
  }
}

function mostrarModalEliminar() {
  modal1 = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
  modal1.show();
}

async function confirmarEliminar() {
  await actualizarAsesor(asesorEliminar.value);
  await consultarAsesores();
}

const buscarAsesores = () => {
  const busquedaValor = busqueda.value.toLowerCase();
  if (busquedaValor === "") {
    asesoresFiltrados.value = asesores.value;
  } else {
    asesoresFiltrados.value = asesores.value.filter((asesor) => {
      return (
        asesor.Nombre.toLowerCase().includes(busquedaValor) ||
        asesor.Apellido_Paterno.toLowerCase().includes(busquedaValor) ||
        asesor.Apellido_Materno.toLowerCase().includes(busquedaValor)
      );
    });
  }
};

function actualizarTabla() {
  let busquedaValor;
  if (busqueda.value.trim() == "") {
    asesoresFiltrados.value = asesores.value;
  } else {
    busquedaValor = busqueda.value.replace(/ /g, "");
    asesoresFiltrados.value = [];
    let nomAsesor;
    asesores.value.forEach((element) => {
      nomAsesor = element.Nombre + element.Apellido_Paterno + element.Apellido_Materno;

      if (nomAsesor.toLowerCase().includes(busquedaValor.toLowerCase())) {
        asesoresFiltrados.value.push(element);
      }
    });
  }
}

//Obtiene todos los asesores
async function traerTodos() {
  todos.value = (await obtenerTodos()).data.body;
  console.log("Aarón camarón");
}

const revisarAsesorExistente = () => {
  if (
    nombre.value.trim() == "" ||
    nombre.value.trim() == nombreNuevo ||
    apellidoPaterno.value.trim() == "" ||
    apellidoPaterno.value.trim() == paternoNuevo ||
    apellidoMaterno.value.trim() == "" ||
    apellidoMaterno.value.trim() == maternoNuevo
  ) {
    deshabilitado.value = true;
    return;
  }
  try {
    for (var j in todos.value) {
      //checa en todos los asesores, ya sea activos o inactivos de la funcion traerTodos
      if (
        todos.value[j].Nombre.toLowerCase() == nombre.value.trim().toLowerCase() &&
        todos.value[j].Apellido_Materno.toLowerCase() ==
          apellidoMaterno.value.trim().toLowerCase() &&
        todos.value[j].Apellido_Paterno.toLowerCase() ==
          apellidoPaterno.value.trim().toLowerCase()
      ) {
        repetido.value = true;
        deshabilitado.value = true;
        console.log(nombre.value);
        console.log(apellidoMaterno.value);
        console.log(apellidoPaterno.value);
        console.log(todos.value[j].Nombre);
        console.log(todos.value[j].Apellido_Materno);
        console.log(todos.value[j].Apellido_Paterno);
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
    <!------------------------------------------------ROW Titulo y busqueda----------------------------------------------->
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
      <div class="col-7 ms-4 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Asesores BAZ</p>
        </div>
      </div>
      <div class="col-3 align-items-end ps-5 ms-5">
        <div class="row align-items-end pt-2">
          <input
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
            v-model.trim="busqueda"
            @input="actualizarTabla()"
          />
        </div>
      </div>
    </div>
    <!------------------------------------------------ROW Nombre ----------------------------------------------->
    <div class="row mb-3">
      <div class="col-2 mt-2 ms-5">
        <h5 class="italika d-flex justify-content-end">Nombre:</h5>
      </div>
      <div class="col-7">
        <input
          type="text"
          ref="inputRol"
          class="form-control"
          @input="revisarAsesorExistente()"
          v-model.trim="nombre"
        />
      </div>
      <div class="col"></div>
    </div>
    <!------------------------------------------------ROW apellidos y boton ----------------------------------------------->
    <div class="row mb-1">
      <div class="col-1"></div>
      <div class="col-1 ms-5">
        <h5 class="italika d-flex justify-content-end">Apellido paterno:</h5>
      </div>
      <div class="col-3 mt-1">
        <input
          type="text"
          ref="inputRol"
          class="form-control"
          @input="revisarAsesorExistente()"
          v-model.trim="apellidoPaterno"
        />
      </div>
      <div class="col-1 ms-2">
        <h5 class="italika d-flex justify-content-end">Apellido materno:</h5>
      </div>
      <div class="col-3 mt-1 pe-4">
        <input
          type="text"
          ref="inputRol"
          class="form-control"
          @input="revisarAsesorExistente()"
          v-model.trim="apellidoMaterno"
        />
        <div
          v-if="repetido"
          class="alert alert-danger mt-2 d-flex align-items-center"
          style="height: 38px"
          role="alert"
        >
          Asesor ya existe
        </div>
      </div>
      <div class="col">
        <button
          v-if="!botonActualizar"
          class="btn btn-primary"
          type="submit"
          :disabled="deshabilitado"
          @click="crearAsesor()"
        >
          Guardar
        </button>

        <button
          v-if="botonActualizar"
          class="btn btn-success"
          type="submit"
          :disabled="deshabilitado"
          @click="
            modificarAsesor(idBotonActualizar, nombre, apellidoMaterno, apellidoPaterno)
          "
        >
          Actualizar
        </button>
      </div>
    </div>
    <!-------------------------------------------------ROW alertas-------------------------------------------------------->
    <!-- <div class="row">
      <div
          v-if="repetido"
          class="alert alert-danger mt-2 d-flex align-items-center"
          style="height: 38px"
          role="alert"
        >
          "{{ asesorAgregado }}" ya existe
        </div>
    </div> -->
    <!-------------------------------------------TABLA------------------------------------------------------->
    <table
      class="table table-hover table-striped text-center mt-4 mx-auto"
      style="width: 900px"
    >
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Nombre Usuario</th>
          <th scope="col">Apellido paterno</th>
          <th scope="col">Apellido materno</th>
          <th scope="col" class="sticky" style="width: 200px: position: sticky; right: 0">
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asesor in asesoresFiltrados" :key="asesor.idAsesoresBAZ">
          <td>{{ asesor.Nombre }}</td>
          <td>{{ asesor.Apellido_Paterno }}</td>
          <td>{{ asesor.Apellido_Materno }}</td>
          <td scope="row" class="sticky" style="position: sticky">
            <div class="align-items-center">
              <button
                :id="asesor.idAsesoresBAZ"
                :class="[
                  botonActualizar && idBotonActualizar == asesor.idAsesoresBAZ
                    ? 'btn btn-primary mx-1'
                    : 'btn btn-warning mx-1',
                ]"
                type="submit"
                style="border-color: #ffbe16; height: 37px"
                @click="
                  seleccionarAsesor(
                    asesor.idAsesoresBAZ,
                    asesor.Nombre,
                    asesor.Apellido_Materno,
                    asesor.Apellido_Paterno
                  )
                "
              >
                <i
                  :class="[
                    botonActualizar && idBotonActualizar == asesor.idTipos_De_Creditos
                      ? 'fa-solid fa-clock-rotate-left'
                      : 'fa-solid fa-pen-to-square',
                  ]"
                ></i>
              </button>

              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                @click="borrarAsesor(asesor.idAsesoresBAZ)"
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 24.5px; height: 22.75px"
                  src="../assets/basura.png"
                />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
          <h5 class="modal-title" id="exampleModalLabel">Asesores</h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal1"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>¡Crédito guardado exitosamente!</h5>
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
          <h5 class="modal-title" id="exampleModalLabel">Elminar asesor</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar asesor?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="confirmarEliminar()"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { catalogoStore } from "../stores/catalogo";
import router from "../router";
import CompHeader from "../components/Header.vue";

//Declaracion de los constantes de los metodos de la store
const { getidMotocicleta } = catalogoStore();
const { setidMotocicleta } = catalogoStore();
const { consultarMotocicletas } = catalogoStore();
const { obtenerUnModelo } = catalogoStore();
const { agregarModelo } = catalogoStore();
const { actualizarModelo } = catalogoStore();

//Variables reactivas
const nombre = ref("");
const modelo = ref("");
const idModelo = ref(0);
const motoActual = ref([]);
const motos = ref([]);
const motosDesplegadas = ref([]);
const actualizar = ref(false);
const validado = ref(false);
const alertaLlenado = ref(false);
const deshabilitado = ref(true);
const repetido = ref(false);
const vS = ref(false);
const vN = ref(false);
const element = ref(null);

const modeloOriginal = ref("");
var modal;

onMounted(async () => {
  console.log();
  await consultarMotos();
});

//Consultar todas las motos de la base de datos
const consultarMotos = async () => {
  try {
    motos.value = await consultarMotocicletas();
    motos.value = motos.value.data.body;
    motosDesplegadas.value = motos.value;
    console.log(motos.value);
    for (var i in motos.value) {
      if (motos.value[i].estatusVigencia == "1") {
        motos.value[i].estatusVigencia = "Si";
      } else {
        motos.value[i].estatusVigencia = "No";
      }
    }
    console.log(motos.value);
  } catch (error) {
    console.log(error);
  }
};

//Obtener los datos de la moto segun su id (Actualizar)
const obtenerDatosMoto = async (idMoto) => {
  try {
    console.log(idMoto);
    if (idMoto != "") {
      console.log(idMoto);
      motoActual.value = await obtenerUnModelo(idMoto);
      motoActual.value = motoActual.value.data.body[0];
      modeloOriginal.value = motoActual.value.Modelo;
      console.log(motoActual.value);
      modelo.value = motoActual.value.Modelo;
      console.log(motoActual.value.EstatusVigencia);
      if (motoActual.value.estatusVigencia == "1") {
        vS.value = true;
      } else {
        vN.value = true;
      }
    }
  } catch {}
};

//Consultar si el modelo que se desea ingresar ya existe
function consultarModeloExistente() {
  if (modelo.value.trim() == "") {
    deshabilitado.value = true;
    alertaLlenado.value = false;
    repetido.value = false;
    return;
  } else {
    //find obtiene un elemento
    element.value = motos.value.find((element) => {
      return element.Modelo.toLowerCase() == modelo.value.toLowerCase();
    });
  }

  if (element.value == null) {
    repetido.value = false;
    deshabilitado.value = false;
  } else {
    repetido.value = true;
    deshabilitado.value = true;
  }
  return;
}

//Guarda una nueva moto
const crearModelo = async () => {
  try {
    //Almenos uno de los 2 tiene que estar seleccionado

    if (vS.value == true) {
      const motoNueva = {
        idMoto: 0,
        Modelo: modelo.value,
        EstatusVigencia: 1,
      };
      await agregarModelo(motoNueva);

      modal = new bootstrap.Modal(document.getElementById("modal"), {
        keyboard: false,
      });
      modal.show();
    } else if (vN.value == true) {
      const motoNueva = {
        idMoto: 0,
        Modelo: modelo.value,
        EstatusVigencia: 2,
      };
      await agregarModelo(motoNueva);

      modal = new bootstrap.Modal(document.getElementById("modal"), {
        keyboard: false,
      });
      modal.show();
    } else {
      alertaLlenado.value = true;
    }
  } catch {
    console.log(error);
  }
};

//Actualiza una moto seleccionada
const actualizarMoto = async () => {
  try {
    if (vS.value == true) {
      const motoAct = {
        idMoto: idModelo.value,
        Modelo: modelo.value,
        EstatusVigencia: 1,
      };
      await actualizarModelo(motoAct);

      modal = new bootstrap.Modal(document.getElementById("modalAct"), {
        keyboard: false,
      });
      modal.show();
    } else if (vN.value == true) {
      const motoAct = {
        idMoto: idModelo.value,
        Modelo: modelo.value,
        EstatusVigencia: 2,
      };
      await actualizarModelo(motoAct);

      modal = new bootstrap.Modal(document.getElementById("modalAct"), {
        keyboard: false,
      });
      modal.show();
    } else {
      alertaLlenado.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};

//realiza cambios en la pagina al buscar modificar una moto
const actModelo = async (idMoto) => {
  try {
    resetCampos();
    idModelo.value = idMoto;
    console.log(idModelo.value);
    obtenerDatosMoto(idMoto);
    actualizar.value = true;
    deshabilitado.value = false;

    document.getElementById("guardar").style.display = "none";
    document.getElementById("actualizar").style.display = "inline-block";
  } catch (error) {
    console.log(error);
  }
};

//Regrasar a crear
const regresar = async () => {
  try {
    actualizar.value = false;
    deshabilitado.value = true;
    resetCampos();

    document.getElementById("guardar").style.display = "inline-block";
    document.getElementById("actualizar").style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

//Verificar que solo un checkbox este seleccionado
function checkboxSi() {
  vN.value = false;
}

function checkboxNo() {
  vS.value = false;
}

//Verifica los datos colocados
function sbmtMoto() {
  if (actualizar.value == false) {
    crearModelo();
    consultarMotos();
  } else {
    actualizarMoto();
    consultarMotos();
  }
}

//Borra los campos cuando se vuelver a agregar nueva moto despes de
//actualizar
function resetCampos() {
  modelo.value = "";
  alertaLlenado.value = false;
  repetido.value = false;
  deshabilitado.value = true;
  vS.value = false;
  vN.value = false;
  idModelo.value = 0;
}

//Actualiza la tabla segun lo que se coloque en el buscador
function actualizarTabla(nombre) {
  if (nombre.trim() == "") {
    motosDesplegadas.value = motos.value;
  } else {
    motosDesplegadas.value = [];
    motos.value.forEach((element) => {
      if (element.Modelo.toLowerCase().includes(nombre.toLowerCase())) {
        motosDesplegadas.value.push(element);
      }
    });
  }
}

function verMotos() {
  //router.push({ name: 'usuarioRegistrado'});
  modal.hide();
  resetCampos();
  consultarMotos();
}

function volverAMotos() {
  //router.push({ name: 'usuarioRegistrado'});
  modal.hide();
  regresar();
  consultarMotos();
}
</script>

<template>
  <form @submit.prevent="sbmtMoto()" class="needs-validation" novalidate>
    <div class="container-fluid">
      <CompHeader />
      <!-- Row de cabecera -->
      <div class="row mb-0 pt-5">
        <div class="col-1 d-flex justify-content-end">
          <router-link to="/italika">
            <img
              class="img-fluid"
              style="margin-top: 20px; width: 31.23px; height: 35.5px"
              src="../assets/triangulito.png"
            />
          </router-link>
        </div>
        <div class="col ms-4">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Modelos Italika
          </p>
        </div>
        <div class="col-3 align-items-end">
          <div class="row align-items-end pt-2">
            <input
              type="text"
              class="form-control rounded-pill"
              style="width: 250px; height: 50px; border-color: #5e5e5e"
              placeholder="Buscar"
              v-model.trim="nombre"
              @input="actualizarTabla(nombre)"
            />
          </div>
        </div>
      </div>
      <div class="row mb-3 pt-0 d-flex align-items-center">
        <div class="col-1"></div>
        <div class="col-2 p-0" style="margin-top: 32px">
          <h5 class="italika d-flex justify-content-end me-5 py-3 px-3">Modelo:</h5>
        </div>
        <div class="col-3 p-0" style="margin-top: 32px">
          <div class="row">
            <input
              type="text"
              class="form-control"
              style=""
              placeholder=""
              v-model.trim="modelo"
              @input="consultarModeloExistente()"
            />
          </div>
        </div>
        <div class="col-2 mx-5">
          <div class="row align-items-center">
            <h5 class="italika">Modelo disponible:</h5>
          </div>
          <div class="row">
            <div class="col p-0">
              <h5 class="d-inline-block italika pt-2 me-4">Si</h5>
              <input
                type="checkbox"
                @input="checkboxSi()"
                v-model="vS"
                style="width: 30px; height: 30px; border-color: #5e5e5e"
                class="form-check-input"
              />
            </div>
            <div class="col p-0">
              <h5 class="d-inline-block italika pt-2 me-4">No</h5>
              <input
                type="checkbox"
                @input="checkboxNo()"
                v-model="vN"
                style="width: 30px; height: 30px; border-color: #5e5e5e"
                class="form-check-input"
              />
            </div>
          </div>
        </div>
        <div class="col-1 p-0" style="margin-top: 32px">
          <div class="row">
            <button
              class="btn btn-primary"
              id="guardar"
              type="submit"
              v-bind:disabled="deshabilitado"
            >
              Guardar
            </button>
            <button
              class="btn btn-success"
              id="actualizar"
              type="submit"
              v-bind:disabled="deshabilitado"
            >
              Actualizar
            </button>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
      <!-- Alertas -->
      <div class="row d-flex align-items-center">
        <div class="col-3"></div>
        <div class="col">
          <div
            v-if="repetido"
            class="alert alert-danger mt-0 d-flex align-items-center"
            style="height: 38px; margin-bottom: 0px"
            role="alert"
          >
            "{{ modelo }}" ya existe
          </div>
        </div>
        <div class="col-3"></div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col">
          <div
            v-if="alertaLlenado"
            class="alert alert-danger d-flex align-items-center"
            style="height: 38px; margin-bottom: 0px"
            role="alert"
          >
            Por favor, llene todos los campos
          </div>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </form>
  <div class="container-fluid">
    <table
      class="table table-hover table-striped text-center mt-4 mx-auto"
      style="width: 750px"
    >
      <thead>
        <tr style="background-color: #2b4677; color: white; vertical-align: middle">
          <th scope="col">Modelo</th>
          <th scope="col">Modelo disponible</th>
          <th scope="col" class="sticky" style="position: sticky; right: 0">Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="moto in motosDesplegadas">
          <td>
            {{ moto.Modelo }}
          </td>
          <td>
            {{ moto.estatusVigencia }}
          </td>
          <th scope="row" class="sticky" style="position: sticky">
            <div class="align-items-center">
              <button
                v-if="moto.idMoto != idModelo"
                class="btn btn-primary mx-1 btn-spacer"
                id="modificar"
                type="submit"
                style="background-color: #ffbe16; border-color: #ffbe16; height: 37px"
                @click="actModelo(moto.idMoto)"
              >
                <i
                  class="fa-solid fa-pen-to-square"
                  style="color:black;width: 24.5px; height: 25.75px; margin-top: 0%; padding-bottom: 2px; !important"
                ></i>
              </button>
              <button
                v-if="moto.idMoto == idModelo"
                class="btn btn-primary mx-1 "
                id="regresar"
                type="submit"
                style="border-color: #ffbe16; height: 37px; border-width: 3px"
                @click="regresar()"
              >
                <i
                  class="fa-solid fa-clock-rotate-left"
                  style="width: 24.5px; height: 25.75px; margin-top: 0%; padding-bottom: 2px; !important"
                ></i>
              </button>
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">¡Moto creada!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">La moto {{ modelo }} fue creada exitosamente.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="volverAMotos()">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="modalAct"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">¡Moto actualizada!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div v-if="modeloOriginal != modelo" class="modal-body">
          La moto "{{ modeloOriginal }}" fue actualizada a "{{ modelo }}" exitosamente.
        </div>
        <div v-if="modeloOriginal == modelo" class="modal-body">
          La moto "{{ modelo }}" fue actualizada exitosamente.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="volverAMotos()">
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

.table-striped tbody tr:nth-of-type(even) {
  background-color: #ccc9c9;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #ffffff;
}
.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
  background-color: #bebebe;
}
#actualizar {
  display: none;
}
#guardar {
  display: inline-block;
}
</style>

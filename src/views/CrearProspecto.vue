<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { clientesStore } from "../stores/clientes";

import CompHeader from "../components/Header.vue";
import router from "../router";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { clienteExiste, agregarCliente } = clientesStore();


//variables reactivas
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const noBAZ = ref("");

const mediosContacto = ref(["medio", "medio", "medio"]);

const deshabilitado = ref(false);
const repetido = ref(false);

const btnSeguirCreando = ref(null);
const tagNombre = ref(null);
const tagPaterno = ref(null);
const tagMaterno = ref(null);
const tagTelefono = ref(null);
const tagEmail = ref(null);
const tagBAZ = ref(null);

const clientesRepetidos = ref([]);

var nombreRep, paternoRep, maternoRep;
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

//función que vacía el textbox, el arreglo de permisos arreglados y deselecciona los checkbox
//se activará cuando se de click en "seguir creando roles" en el modal
function resetCampos() {
  nombre.value = "";
  paterno.value = "";
  materno.value = "";
  email.value = "";
  telefono.value = "";
  noBAZ.value = "";

  alertaLlenado.value = false;
  validado.value = true;

  let elements = document.querySelectorAll(".inptElement");
  Array.prototype.slice.call(elements).forEach(function (input) {
    input.style.borderWidth = "0px";
  });
}

async function revisarClienteExistente() {
  try {
    const cliente = {
      Nombre: nombre.value,
      Apellido_Paterno: paterno.value,
      Apellido_Materno: materno.value,
    };
    const existe = await clienteExiste(cliente);
    console.log("existe?");
    console.log(existe);
    if (existe) {
      nombreRep = nombre.value;
      paternoRep = paterno.value;
      maternoRep = materno.value;
    }

    return existe;
  } catch (error) {
    console.log(error);
  }
}

//metodo que crea el nuevo rol
const crearCliente = async () => {
  try {
    let baz;
    noBAZ.value == "" ? (baz = null) : (baz = noBAZ.value);
    const cliente = {
      idClientes: 0,
      EstatusActividad_idEstatusActividad: 1,
      Nombre: nombre.value,
      Apellido_Paterno: paterno.value,
      Apellido_Materno: materno.value,
      Telefono: telefono.value,
      NoClienteBAZ: baz,
      Correo: email.value,
    };
    await agregarCliente(cliente); //creamos el rol

    modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito
    var myModal = document.getElementById("modal");

    myModal.addEventListener("shown.bs.modal", function () {
      btnSeguirCreando.value.focus();
      btnSeguirCreando.value.style.borderColor = "#90aee5";
      btnSeguirCreando.value.style.borderWidth = "4px";
    });
  } catch (error) {
    console.log(error);
  }
};

function validarEmail() {
  email.value = email.value.trim();
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var pswd = document.getElementById("emailInpt");
  if (!re.test(email.value)) {
    pswd.style.borderColor = "red";
    pswd.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    pswd.style.borderColor = "#3ac74d";
    pswd.style.borderWidth = "0px";
    return true;
  }
}

function validarTlfn() {
  let tlfnInpt = document.getElementById("tlfn");
  var re = /^[0-9]+$/;
  if (!(telefono.value.length == 10 && telefono.value.match(re))) {
    tlfnInpt.style.borderColor = "red";
    tlfnInpt.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    tlfnInpt.style.borderColor = "#3ac74d";
    tlfnInpt.style.borderWidth = "0px";
    return true;
  }
}

function validarNumBAZ() {
  if (noBAZ.value == "") {
    tagBAZ.value.style.borderWidth = "0px";
    return true;
  } else {
    var re = /^[0-9-]+$/;
    if (!(noBAZ.value.length <= 16 && noBAZ.value.match(re))) {
      tagBAZ.value.style.borderColor = "red";
      tagBAZ.value.style.borderWidth = "4px";
      validado.value = false;
      return false;
    } else {
      tagBAZ.value.style.borderColor = "#3ac74d";
      tagBAZ.value.style.borderWidth = "0px";
      return true;
    }
  }
}

function validarTexto(input) {
  //input.value = input.value.trim();
  var re = /^[a-zA-Z ]+$/;
  // var pswd = document.getElementById("emailInpt");
  if (!re.test(input.value)) {
    input.style.borderColor = "red";
    input.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    input.style.borderColor = "#3ac74d";
    input.style.borderWidth = "0px";
    return true;
  }
}

async function sbmtUsuario() {
  const validado =
    validarEmail() &&
    validarTlfn() &&
    validarTexto(tagNombre.value) &&
    validarTexto(tagPaterno.value) &&
    validarTexto(tagMaterno.value) &&
    validarNumBAZ();
  if (validado) {
    alertaLlenado.value = false;
    if (!(await revisarClienteExistente())) {
      repetido.value = false;
      crearCliente();
    } else {
      repetido.value = true;
    }
  } else {
    validarEmail();
    validarTlfn();
    validarTexto(tagNombre.value);
    validarTexto(tagPaterno.value);
    validarTexto(tagMaterno.value);
    validarNumBAZ();
    alertaLlenado.value = true;
  }
}

function verProspectos() {
  modal.hide();
  router.push({ name: "prospectos" });
}
</script>

<template>
  <form @submit.prevent="sbmtUsuario()" class="needs-validation" novalidate>
    <div class="container-fluid">
      <CompHeader />
      <!-----------------------    Row de titulo  --------------------------->
      <div class="row mb-1 pt-5">
        <div class="col-1 d-flex justify-content-end">
          <router-link to="/clientes">
            <img
              class="img-fluid"
              style="margin-top: 20px; width: 31.23px; height: 35.5px"
              src="../assets/triangulito.png"
            />
          </router-link>
        </div>
        <div class="col ms-4">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Crear Cliente
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col">
          <!-----------------------    Row 1 Formulario   --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Nombre *</h5>
            </div>
            <input
              type="text"
              class="form-control input-f inptElement"
              v-model.trim="nombre"
              @input="validarTexto(tagNombre)"
              ref="tagNombre"
              autofocus
              required
            />
          </div>

          <!-----------------------    Row 2 Formulario  --------------------------->

          <div class="row mb-2 pb-2">
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Apellido paterno *</h5>
                </div>
                <input
                  type="text"
                  class="form-control input-f inptElement"
                  @input="validarTexto(tagPaterno)"
                  ref="tagPaterno"
                  required
                  v-model.trim="paterno"
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Apellido materno *</h5>
                </div>
                <input
                  type="text"
                  class="form-control input-f inptElement"
                  @input="validarTexto(tagMaterno)"
                  ref="tagMaterno"
                  v-model.trim="materno"
                  required
                />
              </div>
            </div>
          </div>
          <!-----------------------    Row 3 Formulario  --------------------------->

          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Correo electrónico *</h5>
            </div>
            <input
              id="emailInpt"
              type="email"
              class="form-control inptElement"
              @input="validarEmail()"
              ref="tagEmail"
              v-model.trim="email"
              required
            />
          </div>
          <!-----------------------    Row 4 Formulario  --------------------------->
          <div class="row mb-2 pb-2">
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Teléfono *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement"
                  @input="validarTlfn()"
                  v-model.trim="telefono"
                  maxlength="10"
                  ref="tagTelefono"
                  required
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">No. Cliente BAZ</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  ref="tagBAZ"
                  maxlength="16"
                />
              </div>
            </div>
          </div>
          <!-----------------------    Row 5 Formulario  --------------------------->
          <div class="row mb-2 pb-2">
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Motocicleta *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement"
                  @input="validarTlfn()"
                  v-model.trim="telefono"
                  maxlength="10"
                  ref="tagTelefono"
                  required
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Medio de contacto</h5>
                </div>
                <select name="select_box" class="form-select" id="select_box">
                  <option
                    v-for="medio in mediosContacto"
                    :key="medio.idMedioDeContacto"
                    value=""
                  >
                    {{ medio.Descricpion }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <!-----------------------    Row 6 Formulario   --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="form-floating">
              <div class="col mt-2 me-5 pe-5">
                <h5 class="italika">No. Cliente BAZ</h5>
              </div>
              <textarea
                class="form-control"
                id="floatingTextarea2"
                style="height: 100px"
              ></textarea>
            </div>
          </div>
          <!-----------------------    Row 7 Formulario  --------------------------->
          <div class="row">
            <div
              v-if="alertaLlenado"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              Por favor, llene correctamente todos los campos obligatorios
            </div>
          </div>
          <div class="row">
            <div
              v-if="repetido"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              El cliente "{{ nombreRep }} {{ paternoRep }} {{ maternoRep }}" ya existe
            </div>
          </div>
          <div class="row mb-2 pb-2 mt-4">
            <div class="col d-flex justify-content-center">
              <button
                class="btn btn-primary"
                style="width: 25%"
                type="submit"
                :disabled="deshabilitado"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </form>

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
          <h5 class="modal-title" id="staticBackdropLabel">¡Prospecto creado!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">El prospecto fue creado exitosamente.</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="resetCampos()"
            data-bs-dismiss="modal"
            ref="btnSeguirCreando"
          >
            Seguir creando prospectos
          </button>
          <button type="button" class="btn btn-success" @click="verProspectos()">
            Ver prospectos
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
</style>

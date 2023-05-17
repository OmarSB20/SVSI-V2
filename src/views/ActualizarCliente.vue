<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { clientesStore } from "../stores/clientes";

import CompHeader from "../components/Header.vue";
import router from "../router";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const {
  clienteExiste,
  agregarCliente,
  getIdCliente,
  setIdCliente,
  obtenerCliente,
} = clientesStore();

//variables reactivas
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const noBAZ = ref("");

const deshabilitado = ref(false);
const repetido = ref(false);

const btnSeguirCreando = ref(null);
const tagNombre = ref(null);
const tagPaterno = ref(null);
const tagMaterno = ref(null);
const tagTelefono = ref(null);
const tagEmail = ref(null);
const tagBAZ = ref(null);

const sinCambios = ref(false);
const clientesRepetidos = ref([]);
const idClienteAct = ref(null);

var nombreRep, paternoRep, maternoRep;
var nombreIni, paternoIni, maternoIni, telefonoIni, correoIni, bazIni;
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  idClienteAct.value = getIdCliente();
  if (idClienteAct.value == null) {
    modal = new bootstrap.Modal(document.getElementById("modalError"), {
      keyboard: false,
    });
    modal.show();
  }

  await cargarDatos();
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

async function cargarDatos() {
  let cliente = await obtenerCliente(idClienteAct.value);
  cliente = cliente.data.body[0];
  nombre.value = cliente.Nombre;
  paterno.value = cliente.Apellido_Paterno;
  materno.value = cliente.Apellido_Materno;
  email.value = cliente.Correo;
  telefono.value = cliente.Telefono;
  cliente.NoClienteBAZ==null? noBAZ.value="": noBAZ.value = cliente.NoClienteBAZ;
  

  nombreIni = nombre.value;
  paternoIni = paterno.value;
  maternoIni = materno.value;
  correoIni = email.value;
  telefonoIni = telefono.value;
  bazIni = noBAZ.value;
}

async function revisarClienteExistente() {
  try {
    if (
      nombre.value == nombreIni &&
      paterno.value == paternoIni &&
      materno.value == maternoIni &&
      email.value == correoIni &&
      telefonoIni == telefono.value &&
      bazIni == noBAZ.value
    ) {
      sinCambios.value = true;
      return true;
    }

    if (nombre.value == nombreIni &&
      paterno.value == paternoIni &&
      materno.value == maternoIni) {
      return false;
    }

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
      repetido.value=true;

    }

    return existe;
  } catch (error) {
    console.log(error);
  }
}

//metodo que crea el nuevo rol
const actualizarCliente = async () => {
  try {
    let baz;
    noBAZ.value == "" ? (baz = null) : (baz = noBAZ.value);
    const cliente = {
      idClientes: idClienteAct.value,
      EstatusActividad_idEstatusActividad: 1,
      Nombre: nombre.value,
      Apellido_Paterno: paterno.value,
      Apellido_Materno: materno.value,
      Telefono: telefono.value,
      NoClienteBAZ: baz,
      Correo: email.value,
    };
    await agregarCliente(cliente);
    sinCambios.value = false;
    modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito
   
  } catch (error) {
    console.log(error);
  }
};

function validarEmail() {
  //email.value = email.value.trim();
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
  console.log(noBAZ.value);
  if (noBAZ.value == "") {
    tagBAZ.value.style.borderWidth = "0px";
    return true;
  } else {
    var re = /^[0-9- ]+$/;
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
  console.log(input.value);
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
      actualizarCliente();
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

function verClientes() {
  modal.hide();
  router.push({ name: "clientes" });
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
            Actualizar Cliente
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
          <!-----------------------    Row 8 Formulario  --------------------------->
          <div class="row">
            <div
              v-if="alertaLlenado"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              Por favor, llene correctamente todos los campos obligatorios
            </div>
            <div
              v-if="sinCambios"
              class="alert alert-warning mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              No es posible actualizar sin realizar cambios al cliente
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
                class="btn btn-success"
                style="width: 25%"
                type="submit"
                :disabled="deshabilitado"
              >
                Actualizar
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
          <h5 class="modal-title" id="staticBackdropLabel">¡Cliente actualizado!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          El cliente {{ (nombre, paterno, materno) }} fue actualizado exitosamente.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="verClientes()">
            Ver clientes
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="modalError"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Error al cargar los datos</h5>
        </div>
        <div class="modal-body">Vuelva a cargar el rol</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="verClientes()"
          >
            Volver a roles
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

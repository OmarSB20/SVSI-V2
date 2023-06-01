<script setup>
//TODO ACTUALIZAR COMBOBOX
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { clientesStore } from "../stores/clientes";
import { catalogoStore } from "../stores/catalogo";
import { usuariosStore } from "../stores/usuarios";
import { loginStore } from "../stores/login";
import { prospectosStore } from "../stores/prospectos";
import { mediosContactoStore } from "../stores/mediosContacto";

import CompHeader from "../components/Header.vue";
import router from "../router";
import { faAllergies } from "@fortawesome/free-solid-svg-icons";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const {
  clienteExiste,
  agregarCliente,
  setInterfazOrigen,
  getIdCliente,
  setIdCliente,
  obtenerCliente,
  actualizarCliente,
} = clientesStore();
const { consultarMotocicletasActivas, obtenerUnModelo } = catalogoStore();
const { obtenerIdPorUser } = usuariosStore();
const { getUser } = loginStore();

const {
  prospectoExiste,
  agregarProspecto,
  getIdProspecto,
  obtenerProspecto,
} = prospectosStore();
const { obtenerMedios, obtenerMediosN } = mediosContactoStore();

//variables reactivas
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const noBAZ = ref("");

const comentario = ref("");

var medioIni;
var motoIni;
var comentarioIni;

const catalogo = ref();
const mediosContacto = ref([
  { idMedioDeContacto: 1, Descripcion: "df" },
  { idMedioDeContacto: 2, Descripcion: "fd" },
  { idMedioDeContacto: 3, Descripcion: "df" },
]);

const sinCambios = ref(false);
const deshabilitado = ref(false);
const repetido = ref(false);
const expermnt = ref(true);

const idCliente = ref(null);
const idUser = ref(null);
const idProspecto = ref(null);
const idMoto = ref(null);
const idMedio = ref(null);

const tagNombre = ref(null);
const tagPaterno = ref(null);
const tagMaterno = ref(null);
const tagTelefono = ref(null);
const tagEmail = ref(null);
const tagBAZ = ref(null);
const tagMedio = ref(null);
const tagMoto = ref(null);
const tagBordeMoto = ref(null);

const motoValida = ref("");
const medioValido = ref("");

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // El mes se indexa desde 0, por lo que se suma 1
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;

//variable asociada al modal
var modal;
var motoSelected;
var medioSelected;
const validado = ref(true);
const alertaLlenado = ref(false);
const bloqueado = ref(false);
const canActualizar = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  idUser.value = await obtenerIdPorUser({ Usuario: getUser() });
  idProspecto.value = getIdProspecto();

  if (idProspecto.value == null) {
    //router.push({name:"home"})
  } else {
    bloqueado.value = true;
    await cargarDatosProspecto();
    await cargarDatosCliente();
  }

  await obtenerMotos();
  await obtenerMediosF();
  llenarCombos();

  medioIni = tagMedio.value.value;
  motoIni = tagMoto.value.value;
  comentarioIni = comentario.value;
});

async function cargarDatosProspecto() {
  let prospecto = await obtenerProspecto(idProspecto.value);
  prospecto = prospecto.data.body[0];

  idCliente.value = prospecto.Clientes_idClientes;
  idMedio.value = prospecto.MedioDeContacto_idMedioDeContacto;
  idMoto.value = prospecto.Moto_idMoto;
  comentario.value = prospecto.Comentario;
}

async function cargarDatosCliente() {
  let cliente = await obtenerCliente(idCliente.value);
  console.log(cliente);
  cliente = cliente.data.body[0];
  nombre.value = cliente.Nombre;
  paterno.value = cliente.Apellido_Paterno;
  materno.value = cliente.Apellido_Materno;
  email.value = cliente.Correo;
  telefono.value = cliente.Telefono;
  let numBAZ;
  cliente.NoClienteBAZ == null ? (numBAZ = "") : (numBAZ = cliente.NoClienteBAZ);
  noBAZ.value = numBAZ;
  console.log(cliente);

  var inputs = document.querySelectorAll(".base");
  Array.prototype.slice.call(inputs).forEach(function (input) {
    input.style.backgroundColor = "#aaaaaa";
  });
}

async function obtenerMotos() {
  catalogo.value = (await consultarMotocicletasActivas()).data.body;
  motoSelected = await obtenerUnModelo(idMoto.value);
  motoSelected = motoSelected.data.body[0].Modelo;
}

async function obtenerMediosF() {
  mediosContacto.value = (await obtenerMedios()).data.body;
  medioSelected = await obtenerMediosN(idMedio.value);
  medioSelected = medioSelected.data.body[0].Descripcion;
}

function llenarCombos() {
  console.log("llenando combos");
  const config = {
    search: true,
    clearable: true,
  };
  let select = document.getElementById("select1");
  mediosContacto.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Descripcion;
    optionElement.value = option.idMedioDeContacto;
    if (medioSelected == option.Descripcion) {
      console.log("si");
      optionElement.selected = true;
    }
    select.add(optionElement);
  });

  dselect(tagMedio.value, config); //si jala, no mover xd

  select = document.getElementById("select2");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    console.log(motoSelected == option.Modelo);
    if (motoSelected == option.Modelo) {
      optionElement.selected = true;
    }
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd
  console.log("acabando Llenar combos");
}

async function seleccionCliente() {
  setInterfazOrigen("actualizarProspecto");
  //await modal.hide();

  router.push({ name: "seleccionCliente" });
}

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
    input.style.borderWidth = "0px";
    return true;
  }
}

function validarMoto() {
  console.log(tagMoto.value.value);
  console.log(tagMoto.value.value == -1);
  if (tagMoto.value.value == -1) {
    motoValida.value = "comboMoto";

    return false;
  } else {
    motoValida.value = "";
    return true;
  }
}

function validarMedio() {
  if (tagMedio.value.value == -1) {
    medioValido.value = "comboMedio";
    return false;
  } else {
    medioValido.value = "";
    return true;
  }
}

async function revisarProspecto() {
  if (
    comentarioIni == comentario.value &&
    motoIni == tagMoto.value.value &&
    medioIni == tagMedio.value.value
  ) {
    sinCambios.value = true;
    return false;
  }

  let prospecto = {
    idProspectos: idProspecto.value,
    Moto_idMoto: tagMoto.value.value,
    MedioDeContacto_idMedioDeContacto: tagMedio.value.value,
    Comentario: comentario.value,
  };

  if (
    (comentarioIni != comentario.value || medioIni != tagMedio.value.value) &&
    motoIni == tagMoto.value.value
  ) {
    await actualizarProspecto(); //tambien actualiza
    return true;
  }

  prospecto = {
    Moto_idMoto: tagMoto.value.value,
    Clientes_idClientes: idCliente.value,
    Fecha_registro: formattedDate,
  };

  console.log(await prospectoExiste(prospecto));
  if (await prospectoExiste(prospecto)) {
    repetido.value = true;
    return false;
  }
  await actualizarProspecto();
  repetido.value = false;
  return true;
}

async function actualizarProspecto() {
  try {
    const prospecto = {
      idProspectos: idProspecto.value,
      Moto_idMoto: tagMoto.value.value,
      MedioDeContacto_idMedioDeContacto: tagMedio.value.value,
      Comentario: comentario.value,
    };

    await agregarProspecto(prospecto); //tambien actualiza
    repetido.value = false;
    modal = new bootstrap.Modal(document.getElementById("modalActualizado"), {
      keyboard: false,
    });
    await modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito
    sinCambios.value = false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function sbmtUsuario() {
  repetido.value = false;
  const validado = validarMoto() && validarMedio();
  if (validado) {
    alertaLlenado.value = false;
    await revisarProspecto();
  } else {
    validarEmail();
    validarTlfn();
    validarTexto(tagNombre.value);
    validarTexto(tagPaterno.value);
    validarTexto(tagMaterno.value);
    validarNumBAZ();
    validarMoto();
    validarMedio();
    alertaLlenado.value = true;
  }
}

async function verProspectos() {
  await modal.hide();
  console.log("escondido");
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
          <router-link to="/prospectos">
            <img
              class="img-fluid"
              style="margin-top: 20px; width: 31.23px; height: 35.5px"
              src="../assets/triangulito.png"
            />
          </router-link>
        </div>
        <div class="col ms-4">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Actualizar Prospecto
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col">
          <!-----------------------    Row BOTONES   --------------------------->
          <div
            class="row mb-1 d-flex align-items-center justify-content-end"
            v-if="false"
          >
            <div class="col-5"></div>
            <div class="col d-flex align-items-center justify-content-end">
              <button type="button" class="btn btn-success" @click="seleccionCliente()">
                Seleccionar cliente
              </button>
            </div>
          </div>

          <!-----------------------    Row 1 Formulario   --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Nombre *</h5>
            </div>
            <input
              type="text"
              class="form-control input-f inptElement base"
              v-model.trim="nombre"
              @input="validarTexto(tagNombre)"
              ref="tagNombre"
              :disabled="bloqueado"
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
                  class="form-control input-f inptElement base"
                  @input="validarTexto(tagPaterno)"
                  ref="tagPaterno"
                  required
                  :disabled="bloqueado"
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
                  class="form-control input-f inptElement base"
                  @input="validarTexto(tagMaterno)"
                  ref="tagMaterno"
                  v-model.trim="materno"
                  :disabled="bloqueado"
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
              class="form-control inptElement base"
              @input="validarEmail()"
              ref="tagEmail"
              :disabled="bloqueado"
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
                  class="form-control inptElement base"
                  @input="validarTlfn()"
                  v-model.trim="telefono"
                  maxlength="10"
                  ref="tagTelefono"
                  :disabled="bloqueado"
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
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="bloqueado"
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
                <div ref="tagBordeMoto">
                  <select
                    :class="motoValida"
                    id="select2"
                    @change="validarMoto()"
                    ref="tagMoto"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-1">
                  <h5 class="italika">Medio de contacto *</h5>
                </div>
                <select
                  :class="medioValido"
                  id="select1"
                  @change="validarMedio()"
                  ref="tagMedio"
                >
                  <option value="-1">Seleccionar</option>
                </select>
              </div>
            </div>
          </div>
          <!-----------------------    Row 6 Formulario   --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="form-floating">
              <div class="col mt-2 me-5 pe-5">
                <h5 class="italika">Comentario</h5>
              </div>
              <textarea
                class="form-control"
                id="floatingTextarea2"
                style="height: 100px"
                v-model.trim="comentario"
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
            <div
              v-if="sinCambios"
              class="alert alert-warning mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              No es posible actualizar sin realizar cambios al prospecto
            </div>
          </div>
          <div class="row">
            <div
              v-if="repetido"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              ¡Alguien ya registró este prospecto hoy!
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

  <!-- Modal actualizar cliente -->
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
          <h5 class="modal-title" id="staticBackdropLabel">Cliente ya existente</h5>
        </div>
        <div class="modal-body">
          El cliente {{ nombre }} {{ paterno }} {{ materno }} ya está registrado con otros
          datos ¿Desea actualizar el cliente con los datos aquí escritos o utilizar los
          datos ya registrados anteriormente? El prospecto se generará al terminar
          cualquiera de las acciones.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="actCliente(idCliente)">
            Actualizar cliente y crear
          </button>
          <button type="button" class="btn btn-primary" @click="noActualizar()">
            No actualizar y crear
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!---------Modal Cliente actualizado----->
  <div
    class="modal fade"
    id="modalActualizado"
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
        <div class="modal-body">¡El prospecto fue actualizado!</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="verProspectos()"
          >
            Aceptar
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

select.comboMoto + div > button {
  border-color: red;
  border-width: 5px;
  border-style: solid;
}

select.comboMedio + div > button {
  border-color: red;
  border-width: 5px;
  border-style: solid;
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

.dselect-clear {
  margin-right: 0.5rem !important;
}
</style>
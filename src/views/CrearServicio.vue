<script setup>
//TODO ACTUALIZAR COMBOBOX
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { catalogoStore } from "../stores/catalogo";
import { loginStore } from "../stores/login";
import { prospectosStore } from "../stores/prospectos";
import { mediosContactoStore } from '../stores/mediosContacto';

import { motosTallerStore } from "../stores/motosTaller";
import { estatusServicioStore } from "../stores/estatusServicio";
import { usuariosStore } from "../stores/usuarios";
import { clientesStore } from "../stores/clientes";
import { serviciosStore } from "../stores/servicios";
import CompHeader from "../components/Header.vue";
import router from "../router";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { consultarMotocicletasActivas } = catalogoStore();
const { prospectoExiste, agregarProspecto } = prospectosStore();
const { obtenerMedios } = mediosContactoStore();

//Metodos de la Store para Servicios

const {
  clienteExiste,
  agregarCliente,
  setInterfazOrigen,
  getIdCliente,
  setIdCliente,
  obtenerCliente,
  actualizarCliente, getInterfazOrigen
} = clientesStore();
const { obtenerIdPorUser } = usuariosStore();
const {agregarMotoTaller,consultarMotosTaller,obtenerMotoTaller} = motosTallerStore;
const { getUser } = loginStore();
const { servicioExiste, agregarServicio,obtenerServicio } = serviciosStore();
const {obtenerEstatusServicios,obtenerEstatusServicioN,
       obtenerNombresEstatusServicio, agregarEstatusServicio} = estatusServicioStore;


//variables reactivas
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const noSerie = ref("");
const motoTaller = ref("");
const noBAZ = ref("");
const importe = ref("");
const Kilometraje = ref("");
const cantidad = ref("");
const estatusServicio = ref();
const descripcion = ref("");


const catalogo = ref();
const mediosContacto = ref([
  { idMedioDeContacto: 1, Descripcion: "df" },
  { idMedioDeContacto: 2, Descripcion: "fd" },
  { idMedioDeContacto: 3, Descripcion: "df" },
]);


const deshabilitado = ref(false);
const repetido = ref(false);
const expermnt = ref(true);

const idCliente = ref(null);
const idUser = ref(null);

const btnSeguirCreando = ref(null);
const tagNombre = ref(null);
const tagPaterno = ref(null);
const tagMaterno = ref(null);
const tagTelefono = ref(null);
const tagEmail = ref(null);
const tagSerie = ref(null);
const tagkilometraje = ref(null);
const tagMoto = ref(null);
const tagImporte = ref(null);
const tagCantidad = ref(null);
const tagEstatus = ref(null);

const motoValida = ref("");
const estatusValido = ref("");
const exists = ref(false);
const existeIgual = ref(false);

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // El mes se indexa desde 0, por lo que se suma 1
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;
console.log(formattedDate);

//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const esNuevo = ref();
const canActualizar = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  idUser.value = await obtenerIdPorUser({ Usuario: getUser() });
  idCliente.value = getIdCliente();
  if (idCliente.value == null) {
    /*modal = new bootstrap.Modal(document.getElementById("modalSelect"), {
      keyboard: false,
    });
    await modal.show();*/
    esNuevo.value = true;
  } else {
    esNuevo.value = false;
    cargarDatosCliente();
  }

  async function cargarDatosCliente() {
  const cliente = (await obtenerCliente(idCliente.value)).data.body[0];
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
  await obtenerEstatusDeServicio();
  await obtenerMediosF();
  llenarCombos();
});

async function obtenerEstatusDeServicio() {
     estatusServicio.value = (await obtenerEstatusDeServicios()).data.body;
}


function llenarCombos() {
  console.log("llenando combos")
  const config = {
    search: true,
    clearable: true
  };
  let select = document.getElementById("select1");
  mediosContacto.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Descripcion;
    optionElement.value = option.idMedioDeContacto;
    select.add(optionElement);
  });

  dselect(tagkilometraje.value, config); //si jala, no mover xd

  select = document.getElementById("select2");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd
  console.log("acabando Llenar combos")
}


async function seleccionCliente() {
  setInterfazOrigen("crearServicio");
  console.log(getInterfazOrigen()) 
  //await modal.hide();

  router.push({ name: "seleccionCliente" });
}


async function resetCampos() {
  
  modal = new bootstrap.Modal(document.getElementById("modal"), {
      keyboard: false,
    });
    await modal.hide();
    await modal.dispose();

  const botones = document.getElementsByClassName('dselect-clear');
  var elementosArray = Array.from(botones);
  elementosArray.forEach(elemento=>{
    elemento.click()
  })
  motoValida.value = "";
  estatusValido.value = "";


  nombre.value = "";
  paterno.value = "";
  materno.value = "";
  email.value = "";
  telefono.value = "";
  noBAZ.value = "";
  descripcion.value = "";
  tagkilometraje.value.value = -1;
  tagMoto.value.value = -1;
  alertaLlenado.value = false;
  validado.value = true;
  deshabilitado.value = false;
  repetido.value = false;
  idCliente.value = null;
  exists.value = false;
  existeIgual.value = false;
  esNuevo.value = true;

  setIdCliente(null);
  var inputs = document.querySelectorAll(".base");
  Array.prototype.slice.call(inputs).forEach(function (input) {
    input.style.backgroundColor = "#FFFFFF";
  });

  idUser.value = await obtenerIdPorUser({ Usuario: getUser() });
 

console.log("antes")
  await obtenerEstatusDeServicio();
  await obtenerMediosF();
  //llenarCombos();
  console.log("despues")
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

// function validarNumBAZ() {
//   if (noBAZ.value == "") {
//     tagSerie.value.style.borderWidth = "0px";
//     return true;
//   } else {
//     var re = /^[0-9-]+$/;
//     if (!(noBAZ.value.length <= 16 && noBAZ.value.match(re))) {
//       tagSerie.value.style.borderColor = "red";
//       tagSerie.value.style.borderWidth = "4px";
//       validado.value = false;
//       return false;
//     } else {
//       tagSerie.value.style.borderWidth = "0px";
//       return true;
//     }
//   }
// }

function validarImporte() {
  let impInput = document.getElementById("tlfn");
  var re = /^[0-9]+$/;
  if (!(importe.value.length >= 3 && importe.value.match(re))) {
    impInput.style.borderColor = "red";
    impInput.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    impInput.style.borderWidth = "0px";
    return true;
  }
}


function validarKilometraje() {
  let kmInput = document.getElementById("tlfn");
  var re = /^[0-9]+$/;
  if (!(importe.value.length >= 3 && importe.value.match(re))) {
    kmInput.style.borderColor = "red";
    kmInput.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    kmInput.style.borderWidth = "0px";
    return true;
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

// function validarMoto() {
//   console.log(tagMoto.value.value);
//   console.log(tagMoto.value.value == -1);
//   if (tagMoto.value.value == -1) {
//     motoValida.value = "comboMoto";

//     return false;
//   } else {
//     motoValida.value = "";
//     return true;
//   }
// }

function validarEstatus() {
  if (tagEstatus.value.value == -1) {
    estatusValido.value = "comboMedio";
    return false;
  } else {
    estatusValido.value = "";
    return true;
  }
}

const revisarCliente = async () => {
  try {
    canActualizar.value = false;
    if (esNuevo.value) {
      exists.value = await clienteExiste({
        Nombre: nombre.value,
        Apellido_Paterno: paterno.value,
        Apellido_Materno: materno.value,
      });

      if (exists.value) {
        idCliente.value = exists.value;
        const existeInactivo = await clienteExiste({
          Nombre: nombre.value,
          Apellido_Paterno: paterno.value,
          Apellido_Materno: materno.value,
          EstatusActividad_idEstatusActividad: 2,
        });
        console.log("existe inactivo:" + existeInactivo);
        if (existeInactivo) {
          modal = new bootstrap.Modal(document.getElementById("modalClienteInhab"), {
            keyboard: false,
          });
          await modal.show();
          return false;
        } else {
          const cliente = {
            Nombre: nombre.value,
            Apellido_Paterno: paterno.value,
            Apellido_Materno: materno.value,
            Telefono: telefono.value,
            NoClienteBAZ: noBAZ.value,
            Correo: email.value,
          };

          existeIgual.value = await clienteExiste(cliente);
          console.log("existe igual:" + existeIgual.value);
          if (!existeIgual.value) {
            console.log("aquidice que no existe igual");
            modal = new bootstrap.Modal(document.getElementById("modalAct"), {
              keyboard: false,
            });
            await modal.show();
            return true;
          }
        }
      } else {
        const cliente = {
          idClientes: 0,
          Nombre: nombre.value,
          EstatusActividad_idEstatusActividad: 1,
          Apellido_Paterno: paterno.value,
          Apellido_Materno: materno.value,
          Telefono: telefono.value,
          NoClienteBAZ: noBAZ.value,
          Correo: email.value,
        };
        idCliente.value = await agregarCliente(cliente);
        await crearServicio();
        //modal = new bootstrap.Modal(document.getElementById("modal"), {
          //keyboard: false,
        //});
        //await modal.show();
        return true;
      }
    }
    console.log("a revisar prospecto");
    await revisarServicio();

    return true;
  } catch (error) {
    console.log(error);
  }
};

async function noActualizar() {
  canActualizar.value = true;
  modal.hide();
  await revisarServicio();
}

async function actCliente(idClient) {
  try {
    modal.hide();
    const cliente = {
      idClientes: idClient,
      Nombre: nombre.value,
      EstatusActividad_idEstatusActividad: 1,
      Apellido_Paterno: paterno.value,
      Apellido_Materno: materno.value,
      Telefono: telefono.value,
      NoClienteBAZ: noBAZ.value,
      Correo: email.value,
    };

    await actualizarCliente(cliente);
    canActualizar.value = true;
    modal = new bootstrap.Modal(document.getElementById("modalActualizado"), {
      keyboard: false,
    });
    await modal.show();

    var myModalEl = document.getElementById("modalActualizado");
    myModalEl.addEventListener("hidden.bs.modal", async function (event) {
      // do something...
      await revisarServicio();
    });
  } catch (error) {
    console.log(error);
  }
}

// async function revisarServicio() {
//   console.log(exists.value || !esNuevo.value);
//   if (exists.value || !esNuevo.value) {
//     const prospecto = {
//       Moto_idMoto: tagMoto.value.value,
//       Clientes_idClientes: idCliente.value,
//       Fecha_registro: formattedDate,
//     };
//     console.log(await servicioExiste(prospecto));
//     if (await servicioExiste(prospecto)) {
//       repetido.value = true;
//       return false;
//     }
//   }
//   repetido.value = false;
//   await crearServicio();
//   return true;
// }

async function crearServicio() {
  try {
    const servicio = {
      idServicios: 0,
      MotosTaller_idMotosTaller: MotosTaller_idMotosTaller.value,
      MedioDeContacto_idMedioDeContacto: tagkilometraje.value.value,
      Empleados_idEmpleados: idUser.value,
      Clientes_idClientes: idCliente.value,
      Comentario: descripcion.value,
      Fecha_registro: formattedDate,
    };

    await agregarProspecto(servicio);
    setIdCliente(null);
    repetido.value = false;
    modal = new bootstrap.Modal(document.getElementById("modal"), {
      keyboard: false,
    });
    await modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function sbmtUsuario() {
  repetido.value = false;
  const validado =
    validarEmail() &&
    validarTlfn() &&
    validarTexto(tagNombre.value) &&
    validarTexto(tagPaterno.value) &&
    validarTexto(tagMaterno.value) &&
    validarNumBAZ() &&
    validarMoto() &&
    validarEstatus();

  if (validado) {
    alertaLlenado.value = false;
    await revisarCliente();
  } else {
    validarEmail();
    validarTlfn();
    validarTexto(tagNombre.value);
    validarTexto(tagPaterno.value);
    validarTexto(tagMaterno.value);
    validarNumBAZ();
    validarMoto();
    validarEstatus();
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
        <div class="col ms-5">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Crear Prospecto
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col">
          <!-----------------------    Row BOTONES   --------------------------->
          <div class="row mb-1 d-flex align-items-center justify-content-end">
            <div class="col-5"></div>
            <div class="col d-flex align-items-center justify-content-end">
              <button type="button" class="btn btn-success" @click="seleccionCliente()">
                Seleccionar cliente
              </button>
            </div>
            <div class="col d-flex align-items-center justify-content-end">
              <button type="button" class="btn btn-primary" @click="resetCampos()">
                Limpiar campos
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
              :disabled="!esNuevo"
              
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
                  :disabled="!esNuevo"
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
                  :disabled="!esNuevo"
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
              :disabled="!esNuevo"
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
                  :disabled="!esNuevo"
                  required
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
             
            </div>
          </div>
          <!-----------------------    Row 5 Formulario  --------------------------->
          <div class="row mb-2 pb-2">
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                <h5 class="italika">No. Serie</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
                  maxlength="16"
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-1">
                  <h5 class="italika">Modelo *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
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
                  <h5 class="italika">Kilometraje *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
                  maxlength="16"
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-1">
                  <h5 class="italika">Importe *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
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
                  <h5 class="italika">Fecha de Registro *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
                  maxlength="16"
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-1">
                  <h5 class="italika">Fecha de Entrega*</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
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
                  <h5 class="italika">Cantidad *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                  @input="validarNumBAZ()"
                  v-model.trim="noBAZ"
                  :disabled="!esNuevo"
                  ref="tagSerie"
                  maxlength="16"
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-1">
                  <h5 class="italika">Estatus de Servicio *</h5>
                </div>
                <select
                  :class="estatusValido"
                  id="select1"
                  @change="validarEstatus()"
                  ref="tagkilometraje"
  

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
                <h5 class="italika">Descripcion</h5>
              </div>
              <textarea
                class="form-control"
                id="floatingTextarea2"
                style="height: 100px"
                v-model="descripcion"
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
              ¡Alguien ya registró este prospecto hoy!
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
  <!-- Modal Seleccion tipo de cliente -->
  <div
    class="modal fade"
    id="modalSelect"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Tipo de cliente</h5>
        </div>
        <div class="modal-body">
          ¿El cliente de este prospecto ya está registrado o es un cliente nuevo?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="seleccionCliente()">
            Ya registrado
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Nuevo
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal creacion -->
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
        </div>
        <div v-show="existeIgual" class="modal-body">
          El cliente {{ nombre }} {{ paterno }} {{ materno }} ya estaba registrado en el
          sistema y sus datos son coincidentes, se creó el prospecto sin generar un nuevo
          cliente
        </div>
        <div v-show="!expermnt" class="modal-body">
          Esto no debería verse
        </div>
        <div v-show="!exists && esNuevo" class="modal-body">
          El Cliente y Prospecto fueron creados exitosamente.
        </div>
        <div v-show="canActualizar || !esNuevo" class="modal-body">
          El prospecto fue creado exitosamente.
        </div>
        
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
  <!-- Modal Cliente inhabilitado -->
  <div
    class="modal fade"
    id="modalClienteInhab"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Imposible crear prospecto</h5>
        </div>
        <div class="modal-body">
          El cliente {{ nombre }} {{ paterno }} {{ materno }} está inhabilitado en el
          sistema. El prospecto no se generará. Consulte con su gerente.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
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
        <div class="modal-body">
          Los datos del cliente {{ nombre }} {{ paterno }} {{ materno }} fueron
          actualizados
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal">
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

.dselect-clear{

  margin-right: .5rem !important;
}
</style>

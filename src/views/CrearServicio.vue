<script setup>
//TODO ACTUALIZAR COMBOBOX
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { loginStore } from "../stores/login";

import { motosTallerStore } from "../stores/motosTaller";
import { estatusServicioStore } from "../stores/estatusServicio";
import { usuariosStore } from "../stores/usuarios";
import { clientesStore } from "../stores/clientes";
import { serviciosStore } from "../stores/servicios";
import CompHeader from "../components/Header.vue";
import router from "../router";


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
const {agregarMotoTaller,consultarMotosTaller,obtenerUnaMotoTaller} = motosTallerStore();
const { getUser } = loginStore();
const { servicioExiste, agregarServicio,obtenerServicio } = serviciosStore();
const {obtenerEstatusServicioN,obtenerNombresEstatusServicio, agregarEstatusServicio} = estatusServicioStore();
const {obtenerEstatusServicios} = estatusServicioStore();

//variables reactivas
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const noSerie = ref("");
const modeloTaller = ref("");
const noBAZ = ref("");
const importe = ref("");
const kilometraje = ref("");
const cantidadServicio = ref("");
const estatusServicio = ref();
const descripcion = ref("");
const idEstAct= ref("");



const deshabilitado = ref(false);
const repetido = ref(false);
const expermnt = ref(true);

const idCliente = ref(null);
const idMotoTaller = ref(null);
const idUser = ref(null);

const btnSeguirCreando = ref(null);
const tagNombre = ref(null);
const tagPaterno = ref(null);
const tagMaterno = ref(null);
const tagTelefono = ref(null);
const tagEmail = ref(null);
const tagSerie = ref(null);
const tagEstatus = ref(null);

const motoValida = ref("");
const estatusValido = ref("");
const exists = ref(false);
const existeIgual = ref(false);
const idMotosTaller = ref ("");

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // El mes se indexa desde 0, por lo que se suma 1
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;
// const formattedDates = `${year}-${month}-${day}`;

//const formattedDate = ref ("");
const formattedDates = ref ("");
console.log(formattedDate);

//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const alertaNoSerie = ref(false);
const esNuevo = ref();
const canActualizar = ref(false);
const existeNoSerie=ref("");

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  idUser.value = await obtenerIdPorUser({ Usuario: getUser() });
  idCliente.value = getIdCliente();
  existeNoSerie.value= await consultarMotosTaller();
  existeNoSerie.value= existeNoSerie.value.data.body;
  console.log(existeNoSerie.value);

  if (idCliente.value == null) {
    /*modal = new bootstrap.Modal(document.getElementById("modalSelect"), {
      keyboard: false,
    });
    await modal.show();*/
    esNuevo.value = true;
  } else {
    esNuevo.value = false;
    cargarDatosCliente();
   //crearMotoTaller();
  }

  async function cargarDatosCliente() {
  const cliente = (await obtenerCliente(idCliente.value)).data.body[0];
  nombre.value = cliente.Nombre;
  paterno.value = cliente.Apellido_Paterno;
  materno.value = cliente.Apellido_Materno;
  email.value = cliente.Correo;
  telefono.value = cliente.Telefono;
  idEstAct.value = cliente.EstatusActividad_idEstatusActividad;

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
  llenarCombos();
});

async function obtenerEstatusDeServicio() {
     estatusServicio.value = (await obtenerEstatusServicios()).data.body;
}


function llenarCombos() {
  console.log("llenando combos")
  const config = {
    search: true,
    clearable: true
  };
  let select = document.getElementById("select1");
  estatusServicio.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Descripcion;
    optionElement.value = option.idEstatusServicio;
    select.add(optionElement);
  });

  dselect(tagEstatus.value, config); //si jala, no mover xd
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
  noSerie.value="";
  kilometraje.value="";
  modeloTaller.value="";
  cantidadServicio.value="";
  importe.value="";
  //tagkilometraje.value.value = -1;
  tagEstatus.value.value = -1;
  alertaLlenado.value = false;
  validado.value = true;
  deshabilitado.value = false;
  repetido.value = false;
  idCliente.value = null;
  exists.value = false;
  existeIgual.value = false;
  esNuevo.value = true;
  // formattedDate="";
  formattedDates.value="";

  setIdCliente(null);
  var inputs = document.querySelectorAll(".base");
  Array.prototype.slice.call(inputs).forEach(function (input) {
    input.style.backgroundColor = "#FFFFFF";
  });

  idUser.value = await obtenerIdPorUser({ Usuario: getUser() });
 

console.log("antes")
  await obtenerEstatusDeServicio();
  //await obtenerMediosF();
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

function validarKilometraje() {
  let klInpt = document.getElementById("kil");
  var re = /^[0-9]+$/;
  // if (!(kilometraje.value.length >= 4 && kilometraje.value.match(re))) {
    if (!( kilometraje.value.match(re))) {
    klInpt.style.borderColor = "red";
    klInpt.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    klInpt.style.borderWidth = "0px";
    return true;
  }
}


function validarFecha() {
  let fechaInput = document.getElementById("fechEn");
  
  if (fechaInput.value.trim() === "") {
    fechaInput.style.borderColor = "red";
    fechaInput.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    fechaInput.style.borderWidth = "0px";
    return true;
  }
}

function validarNoSerie() {
  let noSerInput = document.getElementById("noSr");
  var j=0;
  if (noSerInput.value.trim() === "") {

    noSerInput.style.borderColor = "red";
    noSerInput.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
for(j;j<existeNoSerie.value.length;j++){
    if(existeNoSerie.value[j].NoSerie==noSerie.value) {
    noSerInput.style.borderColor = "red";
    noSerInput.style.borderWidth = "4px";
    validado.value = false;
    alertaNoSerie.value=true;
    return false;
     }
  }
    noSerInput.style.borderWidth = "0px";
    return true;

  }
}

function validarModelo() {
  let modInput = document.getElementById("modMot");
  
  if (modInput.value.trim() === "") {
    modInput.style.borderColor = "red";
    modInput.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    modInput.style.borderWidth = "0px";
    return true;
  }
}

function validarImporte() {
  let impInput = document.getElementById("imp");
  
  if (impInput.value.trim() === "") {
    impInput.style.borderColor = "red";
    impInput.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    impInput.style.borderWidth = "0px";
    return true;
  }
}



function validarTexto(input) {
  input.value = input.value.trim();
  var re = /^[a-zA-Z ]+$/;
  var pswd = document.getElementById("emailInpt");
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
    console.log("REVISANDO CLIENTE");
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
    console.log("a revisar servicio");
    console.log("CLIENTE REVISADO");
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

async function revisarServicio() {
  console.log("REVISAR SERVICIO");
  console.log(exists.value || !esNuevo.value);
  if (exists.value || !esNuevo.value) {
    const servicio = {
      MotosTaller_idMotosTaller: tagEstatus.value.value,
      Clientes_idClientes: idCliente.value,
      FechaRegistro: formattedDate,
      FechaEntrega: formattedDates.value,
      idEstatusActividad: 1
    };
    console.log(await servicioExiste(servicio));
    if (await servicioExiste(servicio)) {
      repetido.value = true;
      return false;
    }
  }
  console.log("REVISANDO SERVICIO");
  repetido.value = false;
  await crearServicio();
  return true;
}

async function crearMotoTaller() {
  try {
    console.log("MODELO");
    console.log(modeloTaller.value);
    console.log("NOSERIE");
    console.log(noSerie.value);
    const motoTaller = {
      idMotosTaller: 0,
      Modelo: modeloTaller.value,
      NoSerie: noSerie.value,
    };
      console.log(motoTaller);
    idMotoTaller.value = await agregarMotoTaller(motoTaller);
    console.log("IMPRIMIR OBJETO");
    console.log(idMotoTaller.value.data.body);
   // await revisarServicio();
   // await crearServicio();
    return true;
  } catch (error) {
    console.log(error);
  }
};






async function crearServicio() {
  try {
    console.log("creando servicio")
    const servicio = {
      idServicios: 0,
      MotosTaller_idMotosTaller: idMotoTaller.value.data.body,
      EstatusServicio_idEstatusServicio: tagEstatus.value.value,
      Empleados_idEmpleados: idUser.value,
      Clientes_idClientes: idCliente.value,
      Importe: importe.value,
     // cantidadServicio: cantidadServicio.value,
      Descripcion: descripcion.value,
      Kilometraje: kilometraje.value,
      FechaRegistro: formattedDate,
      FechaEntrega: formattedDates.value,
      idEstatusActividad:1
    };
    console.log(formattedDate);
    console.log(formattedDates.value);
    await agregarServicio(servicio);
    setIdCliente(null);
    repetido.value = false;

    const modal = new bootstrap.Modal(
      document.getElementById("modal"),
      {
        keyboard: false,
      }
    );
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
    validarKilometraje() &&
    validarFecha() &&
    validarNoSerie() &&
    validarImporte() &&
    validarModelo() &&
   // validarNumBAZ() &&
    // validarMoto() &&
    validarEstatus();

  if (validado) {
    alertaLlenado.value = false;
    await crearMotoTaller();
    await revisarCliente();
  } else {
    validarEmail();
    validarTlfn();
    validarTexto(tagNombre.value);
    validarTexto(tagPaterno.value);
    validarTexto(tagMaterno.value);
    validarFecha();
    validarKilometraje();
    validarNoSerie();
    validarImporte();
    validarModelo();
  //  validarNumBAZ();
    // validarMoto();
    validarEstatus();
    alertaLlenado.value = true;
  }
}

async function verServicios() {

  modal = new bootstrap.Modal(document.getElementById("modal"), {
      keyboard: false,
    });

  await modal.hide();
  console.log("escondido");
  router.push({ name: "servicios" });
}

</script>

<template>
  <form @submit.prevent="sbmtUsuario()" class="needs-validation" novalidate>
    <div class="container-fluid">
      <CompHeader />
      <!-----------------------    Row de titulo  --------------------------->
      <div class="row mb-1 pt-5">
        <div class="col-1 d-flex justify-content-end">
          <router-link to="/servicios">
            <img
              class="img-fluid"
              style="margin-top: 20px; width: 31.23px; height: 35.5px"
              src="../assets/triangulito.png"
            />
          </router-link>
        </div>
        <div class="col ms-5">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Crear Servicio
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
                <h5 class="italika">No. Serie*</h5>
                </div>
                <input
                  id="noSr"
                  type="text"
                  class="form-control inptElement"
                  @input="validarNoSerie()"
                  v-model.trim="noSerie"
                  
                 
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
                  id="modMot"
                  type="text"
                  class="form-control inptElement"
                  @input="validarModelo()"
                  v-model.trim="modeloTaller"
                  
                  
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
                  id="kil"
                  type="text"
                  class="form-control inptElement"
                  @input="validarKilometraje()"
                  v-model.trim="kilometraje"
                  
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
                  id="imp"
                  type="text"
                  class="form-control inptElement"
                  @input="validarImporte()"
                  v-model.trim="importe"
                  
                  ref="tagSerie"
                  maxlength="16"
                />
              </div>
            </div>
          </div>
<!-----------------------    Row 5 Formulario  --------------------------->
<!-- <div class="row mb-2 pb-2"> -->
            <!-- <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Fecha de Registro *</h5>
                </div>
                <input v-model="formattedDate"
                     id="fechR"
                     type="date"
                     class="form-control base"
                      />
              </div>
            </div> -->
            <!-- <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                    <h5 class="italika">Fecha de Entrega*</h5>
                  </div>
                    <input v-model="formattedDates"
                     id="fechEn"
                     type="date"
                     class="form-control  base"
                      />
                </div>
              </div>
            </div> -->
          <!-----------------------    Row 5 Formulario  --------------------------->
<div class="row mb-2 pb-2">
            <!-- <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Cantidad *</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement base"
                
                  v-model.trim="cantidadServicio"
                  
                 
                  maxlength="16"
                />
              </div>
            </div> -->
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                    <h5 class="italika">Fecha de Entrega*</h5>
                  </div>
                    <input v-model="formattedDates"
                     id="fechEn"
                     type="date"
                     class="form-control "
                     @input="validarFecha()"
                      />
                </div>
              </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Estatus de Servicio *</h5>
                </div>
                <select
                  :class="estatusValido"
                  id="select1"
                  @change="validarEstatus()"
                  ref="tagEstatus"
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
              v-if="alertaLlenado && !alertaNoSerie"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              Por favor, llene correctamente todos los campos obligatorios
            </div>
            <div
              v-if="alertaNoSerie"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              Este número e serie ya existe, verifique el número de serie
            </div>
          </div>
          <div class="row">
            <div
              v-if="repetido"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              ¡Alguien ya registró este servicio hoy!
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
          datos ya registrados anteriormente? El servicio se generará al terminar
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
          ¿El cliente de este cliente ya está registrado o es un cliente nuevo?
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
          <h5 class="modal-title" id="staticBackdropLabel">¡Servicio creado!</h5>
        </div>
        <div v-show="existeIgual" class="modal-body">
          El cliente {{ nombre }} {{ paterno }} {{ materno }} ya estaba registrado en el
          sistema y sus datos son coincidentes, se creó el servicio sin generar un nuevo
          cliente
        </div>
        <div v-show="!expermnt" class="modal-body">
          Esto no debería verse
        </div>
        <div v-show="!exists && esNuevo" class="modal-body">
          El Cliente y Servicio fueron creados exitosamente.
        </div>
        <div v-show="canActualizar || !esNuevo" class="modal-body">
          El servicio fue creado exitosamente.
        </div>
        
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="resetCampos()"
            data-bs-dismiss="modal"
            ref="btnSeguirCreando"
          >
            Seguir creando servicios
          </button>
          <button type="button" class="btn btn-success" @click="verServicios()" data-bs-dismiss="modal">
            Ver servicios
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
          <h5 class="modal-title" id="staticBackdropLabel">Imposible crear servicios</h5>
        </div>
        <div class="modal-body">
          El cliente {{ nombre }} {{ paterno }} {{ materno }} está inhabilitado en el
          sistema. El servicios no se generará. Consulte con su gerente.
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
  <pre>{{ modeloTaller }} {{ noSerie }}</pre>
  
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
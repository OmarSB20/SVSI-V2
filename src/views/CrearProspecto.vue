<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { clientesStore } from "../stores/clientes";
import { catalogoStore } from "../stores/catalogo";
import { usuariosStore } from "../stores/usuarios";
import { loginStore } from "../stores/login";
import { prospectosStore } from "../stores/prospectos";

import CompHeader from "../components/Header.vue";
import router from "../router";

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
const { consultarMotocicletasActivas } = catalogoStore();
const { obtenerIdPorUser } = usuariosStore();
const { getUser } = loginStore();

const { prospectoExiste, agregarProspecto } = prospectosStore();
//const { consultarMedios } = mediosStore();

//variables reactivas
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const noBAZ = ref("");
const medio = ref("");
const moto = ref("");
const comentario = ref("");

const catalogo = ref();
const mediosContacto = ref([
  { idMedioDeContacto: 1, Descripcion: "medio1" },
  { idMedioDeContacto: 2, Descripcion: "medio2" },
  { idMedioDeContacto: 3, Descripcion: "medio3" }
]);

const deshabilitado = ref(false);
const repetido = ref(false);

const idCliente = ref(null);
const idUser = ref(null);

const btnSeguirCreando = ref(null);
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
const exists = ref(false);
const existeIgual = ref(false);

const clientesRepetidos = ref([]);

var nombreRep, paternoRep, maternoRep;
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const esNuevo = ref();

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  idUser.value = await obtenerIdPorUser({ Usuario: getUser() });
  idCliente.value = getIdCliente();
  if (idCliente.value == null) {
    modal = new bootstrap.Modal(document.getElementById("modalSelect"), {
      keyboard: false,
    });
    modal.show();
    esNuevo.value = true;
  } else {
    esNuevo.value = false;
    cargarDatosCliente();
  }

  await obtenerMotos();
  llenarCombos();
});

async function obtenerMotos() {
  catalogo.value = (await consultarMotocicletasActivas()).data.body;
}

function llenarCombos() {
  const config = {
    search: true,
  };
  let select = document.getElementById("select1");
  mediosContacto.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Descripcion;
    optionElement.value = option.idMedioDeContacto;
    select.add(optionElement);
  });

  dselect(tagMedio.value, config); //si jala, no mover xd

  select = document.getElementById("select2");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd
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
  // Loop over them and prevent submission
  Array.prototype.slice.call(inputs).forEach(function (input) {
    input.style.backgroundColor = "#aaaaaa";
  });
}

function seleccionCliente() {
  setInterfazOrigen("crearProspecto");
  modal.hide();
  router.push({ name: "seleccionCliente" });
}

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

const revisarCliente = async () => {
  try {
    if (esNuevo.value) {
      exists.value = await clienteExiste({
        Nombre: nombre.value,
        Apellido_Paterno: paterno.value,
        Apellido_Materno: materno.value
      });

      if (exists.value) {
        idCliente.value = exists.value;
        const existeInactivo = await clienteExiste({
          Nombre: nombre.value,
          Apellido_Paterno: paterno.value,
          Apellido_Materno: materno.value,
          EstatusActividad_idEstatusActividad: 2
        });

        if (existeInactivo) {
          modal = new bootstrap.Modal(document.getElementById("modalClienteInhab"), {
            keyboard: false,
          });
          modal.show();
          return false;
        } else {
          let baz;
          noBAZ.value == "" ? (baz = null) : (baz = noBAZ.value);
          const cliente = {
            Nombre: nombre.value,
            Apellido_Paterno: paterno.value,
            Apellido_Materno: materno.value,
            Telefono: telefono.value,
            NoClienteBAZ: baz,
            Correo: email.value
          };

          existeIgual.value = await clienteExiste(cliente);
          if (!existeIgual.value) {
            modal = new bootstrap.Modal(document.getElementById("modalAct"), {
              keyboard: false,
            });
            modal.show();
            return true;
          }
        }
      } else {
        idCliente.value = await agregarCliente(cliente);
      }
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};

async function actCliente(idClient) {
  try {
    await actualizarCliente(idClient);
    modal = new bootstrap.Modal(document.getElementById("modalActualizado"), {
      keyboard: false,
    });
    modal.show();
    await crearProspecto(idClient);
  } catch (error) {
    console.log(error);
  }
}

async function revisarProspecto(idClient) {
  
  if (exists.value) {
    const prospecto = {
      Moto_idMoto: tagMoto.value.value,
      Clientes_idClientes: idCliente.value,
      Fecha_registro: "2023-05-05"
    };

    if (await prospectoExiste(prospecto)) {
      repetido.value = true;
      return false;
    }
  }
  return true;
}

async function crearProspecto(){
try {
  const prospecto = {
      idProspectos: 0,
      Moto_idMoto: tagMoto.value.value,
      MedioDeContacto_idMedioDeContacto: tagMedio.value.value,
      Empleados_idEmpleados: idUser.value,
      Clientes_idClientes: idCliente.value,
      Comentario: comentario.value,
      Fecha_registro: "2023-05-05",
    };

    await agregarProspecto(prospecto);
    return true;
} catch (error) {
  console.log(error)
  return false;

}
  



  modal = new bootstrap.Modal(document.getElementById("modal"), {
      keyboard: false,
    });
    modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito
    var myModal = document.getElementById("modal");

    myModal.addEventListener("shown.bs.modal", function () {
      btnSeguirCreando.value.focus();
      btnSeguirCreando.value.style.borderColor = "#90aee5";
      btnSeguirCreando.value.style.borderWidth = "4px";
    });
}

async function sbmtUsuario() {
  await revisarCliente();
  
  const validado =
    validarEmail() &&
    validarTlfn() &&
    validarTexto(tagNombre.value) &&
    validarTexto(tagPaterno.value) &&
    validarTexto(tagMaterno.value) &&
    validarNumBAZ()&&validarMoto()&&validarMedio();

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
              class="form-control input-f inptElement base"
              v-model.trim="nombre"
              @input="validarTexto(tagNombre)"
              ref="tagNombre"
              :disabled="!esNuevo"
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
                  :disabled="!esNuevo"
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
                <div class="col mt-2 me-5 pe-5">
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
          <button
            type="button"
            class="btn btn-primary"
            @click="crearProspecto(idCliente)"
          >
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
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div v-if="existeIgual" class="modal-body">
          El cliente {{ nombre }} {{ paterno }} {{ materno }} ya estaba registrado en el
          sistema y sus datos son coincidentes, se creó el prospecto sin generar un nuevo
          cliente
        </div>
        <div v-if="esNuevo && !exists" class="modal-body">
          El Cliente y Prospecto fueron creados exitosamente.
        </div>
        <div v-if="!esNuevo" class="modal-body">
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
</style>

<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { usuariosStore } from "../stores/usuarios";
import { rolesStore } from "../stores/roles";

import CompHeader from "../components/Header.vue";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { agregarUsuario } = usuariosStore();
const { obtenerRoles } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { getIdUsuario } = usuariosStore();
const { obtenerNicknames } = usuariosStore();
const { obtenerUnUser } = usuariosStore()
const { actualizarUsuario } = usuariosStore()

//variables reactivas
const nombreRol = ref("");
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const email = ref("");
const telefono = ref("");
const nickname = ref("");
const roles = ref([]);
const arrayNicknames = ref([]);
const contrasena = ref("");
const confContrasena = ref("");
const deshabilitado = ref(true);
const repetido = ref(false);
const tipoConfPass = ref("password");
const tipoPass = ref("password");
const rolSeleccionado = ref("Seleccionar rol");
const idUsrActualizar = ref();
const usuario = ref([]);
const permisosDelRol = ref([]);//Probable necesidad 
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async() => {
  await consultarRoles();
  await consultarUsuarios();
  await obtenerDatosUsr();
  
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

//consulta los roles usando el metodo de la store, los almacena en rolesArray
const consultarRoles = async () => {
  try {
    roles.value = await obtenerRoles();
    roles.value = roles.value.data.body;
    console.log(roles.value);
  } catch (error) {
    console.log(error);
  }
};

const obtenerDatosUsr = async () => {
    try {
        idUsrActualizar.value = getIdUsuario();
        /* VALOR TEMPORAL PARA PRUEBAS - BORRAR AL TERMINAR*/ idUsrActualizar.value=48; /**------------------------------------- */
        usuario.value = await obtenerUnUser(idUsrActualizar.value);
        usuario.value = usuario.value.data.body[0];
        roles.value = await obtenerRoles();
        roles.value = roles.value.data.body;
        roles.value.forEach((element) => {
            if(element.idRoles == usuario.value.Roles_idRoles){
              nombreRol.value = element.Nombre;
                
            }
        });
        console.log(nombreRol.value)
        console.log(usuario.value.Nombre)
        nombre.value = usuario.value.Nombre;
        paterno.value = usuario.value.Apellido_Paterno;
        materno.value = usuario.value.Apellido_Materno;
        email.value = usuario.value.Correo;
        telefono.value = usuario.value.Telefono;
        nickname.value = usuario.value.Usuario;
        contrasena.value = usuario.value.Contrasena;
        confContrasena.value = usuario.value.Contrasena;
        rolSeleccionado.value = nombreRol.value;
        console.log(nombre.value);
        console.log(nickname.value);
        console.log(rolSeleccionado.value);
        return true;
    } catch (error) {
        console.log(error);
    }
}

const consultarUsuarios = async () => {
  try {
    arrayNicknames.value = [];
    let usuarios = await obtenerUsuarios();
    usuarios = usuarios.data.body;
    usuarios.forEach((element) => {
      console.log(element.Usuario);
      arrayNicknames.value.push(element.Usuario);
    });
  } catch (error) {
    console.log(error);
  }
};

function revisarUsuarioExistente() {
  if (nickname.value.trim() == "") {
    deshabilitado.value = true;
    return;
  }

  for (var j in arrayNicknames.value) {
    if (arrayNicknames.value[j].toLowerCase() == nickname.value.trim().toLowerCase()) {
      repetido.value = true;
      deshabilitado.value = true;
      return true;
    }
  }
  repetido.value = false;
  deshabilitado.value = false;
  return false;
}

function colorCampos() {
  if (tried) {
    let aprobado = true;
    validado.value = true;
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var inputs = document.querySelectorAll(".input-f");
    // Loop over them and prevent submission
    Array.prototype.slice.call(inputs).forEach(function (input) {
      if (input.value == "") {
        input.style.borderColor = "red";
        input.style.borderWidth = "4px";
        aprobado = false;
        validado.value = false;
      } else {
        input.style.borderColor = "#3ac74d";
        input.style.borderWidth = "4px";
      }
    });
    return aprobado;
  }
}

function obtenerIdRol(rol) {
  console.log(rol)
  let idRol = -1;
  roles.value.forEach((element) => {
    if (element.Nombre == rol) {
      idRol = element.idRoles;
      return;
    }
  });
  return idRol;
}

//metodo que crea el nuevo rol
const actUsuario = async () => {
  try {
    console.log(rolSeleccionado.value)
    const idRol = obtenerIdRol(rolSeleccionado.value);
    console.log(idRol)
    const usuarioNuevo = {
      idEmpleados: idUsrActualizar.value,
      Roles_idRoles: idRol,
      EstatusActividad_idEstatusActividad: 1,
      Nombre: nombre.value,
      Apellido_Paterno: paterno.value,
      Apellido_Materno: materno.value,
      Telefono: telefono.value,
      Contrasena: contrasena.value,
      Usuario: nickname.value,
      Correo: email.value,
    };
    await actualizarUsuario(usuarioNuevo); //Actualizamos el usuario

    modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito
  } catch (error) {
    console.log(error);
  }
};

function validarEmail() {
  console.log("validandomeail");
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
    pswd.style.borderWidth = "4px";
    return true;
  }
}

function validarTlfn() {
  let tlfnInpt = document.getElementById("tlfn");
  var re = /\d/;
  if (!(telefono.value.length == 10 && re.test(telefono.value))) {
    tlfnInpt.style.borderColor = "red";
    tlfnInpt.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    tlfnInpt.style.borderColor = "#3ac74d";
    tlfnInpt.style.borderWidth = "4px";
    return true;
  }
}

function validarPsw() {
  contrasena.value = contrasena.value.trim();
  compararPsw();
  let pswd = document.getElementById("pswd");

  if (contrasena.value.length < 8) {
    pswd.style.borderColor = "red";
    pswd.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    pswd.style.borderColor = "#3ac74d";
    pswd.style.borderWidth = "4px";
    return true;
  }
}

function compararPsw() {
  confContrasena.value = confContrasena.value.trim();
  let pswd = document.getElementById("pswdC");
  if (!(confContrasena.value == contrasena.value && confContrasena.value != "")) {
    pswd.style.borderColor = "red";
    pswd.style.borderWidth = "4px";
    validado.value = false;
    return false;
  } else {
    pswd.style.borderColor = "#3ac74d";
    pswd.style.borderWidth = "4px";

    return true;
  }
}

function sbmtUsuario() {
  tried = true;
  validado.value = true;
  colorCampos();
  validarEmail();
  validarPsw();
  compararPsw();
  validarTlfn();
  if (validado.value) {
    actUsuario();
  } else {
    alertaLlenado.value = true;
  }
}

function verUsuarios() {
  window.location.href = "http://localhost:5173/modificarRol";
}
</script>

<template>
  <form @submit.prevent="sbmtUsuario()" class="needs-validation" novalidate>
    <div class="container-fluid">
      <CompHeader />
      <!-----------------------    Row de titulo  --------------------------->
      <div class="row mb-3 pt-5">
        <div class="col-1 d-flex justify-content-end">
          <a href="http://localhost:5173">
            <img
              class="img-fluid"
              style="margin-top: 20px; width: 31.23px; height: 35.5px"
              src="../assets/triangulito.png"
            />
          </a>
        </div>
        <div class="col ms-4">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Crear Usuario
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col">
          <!-----------------------    Row 1 Formulario   --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Nombre</h5>
            </div>
            <input
              type="text"
              class="form-control input-f inptElement"
              v-model.trim="nombre"
              @input="colorCampos()"
              required
            />
          </div>

          <!-----------------------    Row 2 Formulario  --------------------------->

          <div class="row mb-2 pb-2">
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Apellido paterno</h5>
                </div>
                <input
                  type="text"
                  class="form-control input-f inptElement"
                  @input="colorCampos()"
                  required
                  v-model.trim="paterno"
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Apellido materno</h5>
                </div>
                <input
                  type="text"
                  class="form-control input-f inptElement"
                  @input="colorCampos()"
                  v-model.trim="materno"
                  required
                />
              </div>
            </div>
          </div>
          <!-----------------------    Row 3 Formulario  --------------------------->

          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Correo electrónico</h5>
            </div>
            <input
              id="emailInpt"
              type="email"
              class="form-control inptElement"
              @input="validarEmail()"
              v-model.trim="email"
              required
            />
          </div>
          <!-----------------------    Row 4 Formulario  --------------------------->
          <div class="row mb-2 pb-2">
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Teléfono</h5>
                </div>
                <input
                  id="tlfn"
                  type="text"
                  class="form-control inptElement"
                  @input="validarTlfn()"
                  v-model.trim="telefono"
                  maxlength="10"
                  required
                />
              </div>
            </div>
            <div class="col-1"></div>
            <div class="col">
              <div class="row d-flex align-items-center">
                <div class="col mt-2 me-5 pe-5">
                  <h5 class="italika">Rol</h5>
                </div>
                <select
                  class="form-select input-f inptElement"
                  aria-label="Default select example"
                  v-model="rolSeleccionado"
                  :value="rolSeleccionado"
                  @change="colorCampos()"
                  required
                >
                  <option v-for="rol in roles">{{ rol.Nombre }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-----------------------    Row 5 Formulario  --------------------------->

          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Nombre de usuario</h5>
            </div>
            <input
              type="text"
              class="form-control input-f inptElement"
              @input="revisarUsuarioExistente()"
              v-model.trim="nickname"
              required
            />
          </div>
          <div
            v-if="repetido"
            class="alert alert-danger mt-2 d-flex align-items-center"
            style="height: 38px"
            role="alert"
          >
            "{{ nickname }}" ya existe
          </div>
          <!-----------------------    Row 6 Formulario  --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Constraseña</h5>
            </div>
            <input
              id="pswd"
              :type="tipoPass"
              class="form-control inptElement"
              @input="validarPsw()"
              v-model="contrasena"
              required
            />
          </div>
          <!-----------------------    Row 7 Formulario  --------------------------->

          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Confirmar constraseña</h5>
            </div>
            <input
              id="pswdC"
              :type="tipoConfPass"
              class="form-control inptElement"
              @input="compararPsw()"
              v-model="confContrasena"
              required
            />
          </div>
          <!-----------------------    Row 8 Formulario  --------------------------->
          <div class="row">
            <div
              v-if="alertaLlenado"
              class="alert alert-danger mt-2 d-flex align-items-center"
              style="height: 38px"
              role="alert"
            >
              Por favor, llene todos los campos
            </div>
          </div>
          <div class="row mb-2 pb-2">
            <div class="col d-flex justify-content-center">
              <button
                class="btn btn-primary"
                style="width: 25%"
                type="submit"
                :disabled="deshabilitado"
              >
                Modificar
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
          <h5 class="modal-title" id="staticBackdropLabel">¡Usuario creado!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">El usuario {{ nickname }} fue creado exitosamente.</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="resetCampos()"
            data-bs-dismiss="modal"
          >
            Seguir creando roles
          </button>
          <button type="button" class="btn btn-success" @click="verUsuarios()">
            Ver roles
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

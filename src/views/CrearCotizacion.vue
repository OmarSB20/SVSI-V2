<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { loginStore } from "../stores/login";

import CompHeader from "../components/Header.vue";
import router from "../router";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene

const deshabilitado = ref(true);
const repetido = ref(false);

//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  deshabilitado.value = true;
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

//función que vacía el textbox, el arreglo de permisos arreglados y deselecciona los checkbox
//se activará cuando se de click en "seguir creando roles" en el modal

</script>

<template>
  <form  class="needs-validation" novalidate>
    <div class="container-fluid">
      <CompHeader />
      <!-----------------------    Row de titulo  --------------------------->
      <div class="row mb-3 pt-5">
        <div class="col-1 d-flex justify-content-end">
          <router-link to="usuarios">
            <img
              class="img-fluid"
              style="margin-top: 20px; width: 31.23px; height: 35.5px"
              src="../assets/triangulito.png"
            />
          </router-link>
        </div>
        <div class="col ms-4">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Agregar Cotización
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-3"></div>
        <div class="col">
          <!-----------------------    Row 1 Formulario   --------------------------->
          <div class="row mb-2 pb-2 d-flex align-items-center">
            <div class="col mt-2">
              <h5 class="italika">Nombre:</h5>
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
                  <h5 class="italika">Apellido paterno:</h5>
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
                  <h5 class="italika">Apellido materno:</h5>
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
              maxlength="23"
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
              Por favor, llene correctamente todos los campos
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
            ref="btnSeguirCreando"
          >
            Seguir creando usuarios
          </button>
          <button type="button" class="btn btn-success" @click="verUsuarios()">
            Ver usuarios
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
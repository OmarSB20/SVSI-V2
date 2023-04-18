<script setup>
import { ref } from "vue";
import { permisosRolesStore } from "../stores/permisosRoles";
import { rolesStore } from "../stores/roles";
import { onMounted } from "vue";
import router  from '../router/index'

import CompHeader from '../components/Header.vue'

const { obtenerPermisosDelRol } = permisosRolesStore();
const { eliminarPermisosDelRol } = permisosRolesStore();
const { obtenerRoles } = rolesStore();
const { eliminarRol } = rolesStore();
const { setRol } = rolesStore();

const rolDir = ref({});
const buscador = ref({});
const roles = ref([]);
const rolesArray = ref([]);
const rolesDesplegados = ref([]);
const permisosDeRolArray = ref([]);
const idRolEliminar = ref();
var modal;
var modalConfirmacion;

onMounted(() => {
  consultarRoles();
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });

  modalConfirmacion = new bootstrap.Modal(document.getElementById("modalCon"), {
    keyboard: false,
  });
});

const consultarRoles = async () => {
  buscador.value = [];
  rolesArray.value = [];
  rolDir.value = [];
  try {
    roles.value = await obtenerRoles();
    const body = roles.value.data.body;
    console.log(roles.value);
    for (var j in body) {
      rolesArray.value.push(body[j]);
      buscador.value.push(body[j].Nombre);
      rolDir.value.push(body[j].idRoles);
    }
    rolesDesplegados.value = rolesArray.value;
  } catch (error) {
    console.log(error);
  }
};

const consultarPermisosDeRol = async (idRol) => {
  permisosDeRolArray.value = [];
  try {
    const permisosDeRol = await obtenerPermisosDelRol(idRol);
    const body = permisosDeRol.data.body;
    for (var j in body) {
      permisosDeRolArray.value.push(body[j]);
    }
    modal.show();
  } catch (error) {
    console.log(error);
  }
};

const eliminarRoles = async (idEmpleados) => {
  try {
    await eliminarPermisosDelRol(idEmpleados);
    await eliminarRol(idEmpleados);
    await consultarRoles();
  } catch (error) {
    console.log(error);
  }
};

const modificarRol = async (idRol) => {
  try {
    setRol(idRol);
    router.push({ name: 'registroRol', params: { idRolAct: idRol }});

    //window.location.href = "http://localhost:5173/registroRol";
    //this.$router.push("http://localhost:5173/crearRol");
  } catch (error) {
    console.log(error);
  }
};

function actualizarTabla(nombre) {
  if (nombre.trim() == "") {
    rolesDesplegados.value = rolesArray.value;
  } else {
    rolesDesplegados.value = [];
    rolesArray.value.forEach((element) => {
      if (element.Nombre.toLowerCase().includes(nombre.toLowerCase())) {
        rolesDesplegados.value.push(element);
      }
    });
  }
}

function confirmar(idRol) {
  idRolEliminar.value = idRol;
  modalConfirmacion.show();
}
</script>
<template>
  <div class="container-fluid">
    <CompHeader/>
    <div class="row ">
      <div class="col-1 mb-3 pt-5">
        <a href="http://localhost:5173">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </a>
      </div>
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Roles</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika d-flex justify-content-start">Registrar Roles</h5>
        </div>
      </div>
      <div class="col-3 align-items-end ">
        <div class="row align-items-end pt-2">
          <input
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
            v-model="nombre"
            @input="actualizarTabla(nombre)"
          />
        </div>
        <div class="row">
          <div class="col-6">
            <h5 class="italika mt-3">Agregar Roles</h5>
          </div>
          <div class="col-1">
            <router-link to="../crearRol">
              <button
                class="btn btn-primary mt-2 d-flex align-items-center"
                type="submit"
                style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;
                "
              >
                <h4>+</h4>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <table
      class="table table-hover table-striped text-center mt-4 mx-auto"
      style="width: 900px"
    >
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Nombre</th>
          <th scope="col" style="width: 200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rol in rolesDesplegados">
          <td>
            {{ rol.Nombre }}
          </td> 
          <th scope="row">
            <div class="align-items-center">
              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #59c01a; border-color: #59c01a; height: 37px"
                @click="consultarPermisosDeRol(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 28.5px; height: 18.75px; margin-top: 0% !important"
                  src="../assets/eyeWhite.png"
                />
              </button>
              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #ffbe16; border-color: #ffbe16; height: 37px"
                @click="modificarRol(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-3"
                  style="width: 24.5px; height: 25.75px; margin-top: 0% !important"
                  src="../assets/lapiz.png"
                />
              </button>
              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                @click="confirmar(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 24.5px; height: 22.75px"
                  src="../assets/basura.png"
                />
              </button>
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal  modalCon-->
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
          <h5 class="modal-title" id="exampleModalLabel">Permisos del Rol</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-for="item in permisosDeRolArray">
            <span>{{ item.Descripcion }}</span>
          </div>
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
    id="modalCon"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Permisos del Rol</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar este permiso?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="eliminarRoles(idRolEliminar)"
          >
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
</style>

<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { usuariosStore } from "../stores/usuarios";
import { rolesStore } from "../stores/roles";
import CompHeader from "../components/Header.vue";
import router from "../router";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { setIdUsuario } = usuariosStore();
const { agregarUsuario } = usuariosStore();
const { obtenerRoles } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();
const { actualizarUsuario } = usuariosStore();
const { getIdUsuario } = usuariosStore();

//variables reactivas
const usuarios = ref({});
const roles = ref([]);
const arrayNicknames = ref([]);
const deshabilitado = ref(true);
//para buscar
const usuariosFiltrados = ref({});
const valorBusqueda = ref("");
const nombreUsuarioAct = ref("");
const idUsuarioAct = ref("");

//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  await consultarRoles();
  await consultarUsuarios();
  deshabilitado.value = true;
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

</script>
<template>
  <div class="container-fluid">
    <CompHeader />

    <div class="row">
      <div class="col-1 mb-3 pt-5">
        <router-link to=" http://localhost:5173">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Medios de contacto</p>
        </div>
      </div>
      <div class="col-3 align-items-end">
        <div class="row align-items-end pt-2">
          <input
            id="myInput"
            v-on:keyup="myFunction"
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
          />
        </div>
      </div>
    </div>
    <div class="row mb-5">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Nombre del medio:</h5>
        </div>
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
        <div class="col">
          <button class="btn btn-success" type="submit" :disabled="deshabilitado">
            Guardar nuevo
          </button>
        </div>
      </div>
    <div class="table-responsive-sm">
      <table
        id="myTable"
        class="table table-hover table-striped text-center mt-4 mx-auto"
        style="width: 950px; overflow-x: scroll"
      >
        <thead>
          <tr style="background-color: #2b4677; color: white; vertical-align: middle">
            <th scope="col">Nombre</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <th scope="col" class="sticky" style="position: sticky; right: 0; width:200px">
              Opciones
            </th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.idEmpleados">
            <td>{{ usuario.Nombre }}</td>
            <td>{{ usuario.Apellido_Paterno }}</td>
            <td>{{ usuario.Apellido_Materno }}</td>
            <td>{{ usuario.Correo }}</td>
            <td>{{ usuario.Telefono }}</td>
            <!-- <td>{{ usuario.Roles_idRoles }}</td>  -->
            <td>{{ buscarRol(usuario.Roles_idRoles) }}</td>
            <td scope="row" class="sticky" style="position: sticky">
              <div class="container">
                <div class="d-inline-flex">
                  <button
                    class="btn btn-primary d-inline-block mr-3 btn-spacer"
                    type="submit"
                    style="
                      background-color: #ffbe16;
                      border-color: #ffbe16;
                      height: 37px;
                      width: 45px;
                    "
                    @click="modificaruser(usuario.idEmpleados)"
                  >
                    <img
                      class="img-fluid mb-3"
                      style="width: 100; height: 20px; margin-top: 0% !important"
                      src="../assets/lapiz.png"
                    />
                  </button>
                  <button
                    class="btn btn-primary d-inline-block"
                    type="submit"
                    style="
                      background-color: #c01a1a;
                      border-color: #c01a1a;
                      height: 37px;
                      width: 45px;
                      margin-top: 0% !important;
                    "
                    @click="mostrarmodal(usuario.Usuario, usuario.idEmpleados)"
                  >
                    <img
                      class="img-fluid mb-1"
                      style="width: 24.5px; height: 22.75px; margin-top: 0% !important"
                      src="../assets/basura.png"
                    />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- <td scope="row">
            <div class ="container">
              
              <div class ="row">
                
                <div class ="col">
                  <button
                class="btn btn-primary   d-inline-block" 
                type="submit"
                style="background-color: #ffbe16; border-color: #ffbe16; height: 37px"
                @click="modificaruser (usuario.idEmpleados)"
              >
                <img
                  class="img-fluid mb-3"
                  style="width: 100; height: 20px; margin-top: 0% !important"
                  src="../assets/lapiz.png"
                />
              </button>
                </div>
                <div class ="col">
                  <button
                class="btn btn-primary d-inline-block"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px; margin-top: 0% !important"
                @click="mostrarmodal(usuario.Usuario, usuario.idEmpleados)"
              >
                <img
                class="img-fluid mb-1"
                  style="width: 24.5px; height: 22.75px ; margin-top: 0% !important"
                  src="../assets/basura.png"
                
                />
              </button>
                </div>
            </div>
         </div>
        
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div> -->

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
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Usuario</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span
            >¿Está seguro de que quiere eliminar al Usuario {{ nombreUsuarioAct }}?</span
          >
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="desactivarUsuario(idUsuarioAct)"
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

.btn-spacer {
  margin-right: 10px;
}
.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
}

#myInput {
  background-repeat: no-repeat;
}

.table-striped tbody tr .sticky {
  background-color: white;
}
.table-striped tbody tr:nth-child(2n) .sticky {
  background-color: inherit;
}

.table-striped tbody th .sticky {
  background-color: #2b4677;
  color: white;
}

#myTable th {
  background-color: #2b4677;
  color: white;
}

#myTable .sticky {
  border-collapse: collapse;
  position: sticky;
  right: 0%;
}

#myTable th,
#myTable td {
  text-align: center;
  padding: 12px;
}

#myTable tr {
  border-bottom: 1px solid #ddd;
}

#myTable tr.header,
#myTable tr:hover {
  background-color: #f1f1f1;
}

.table-container {
  max-width: 100%;
  overflow-x: scroll;
}
</style>

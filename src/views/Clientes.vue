<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { clientesStore } from "../stores/clientes";
import CompHeader from "../components/Header.vue";
import router from "../router";

const { setIdCliente, obtenerClientesActivos, actualizarCliente } = clientesStore();

const clientes = ref();
const clientesMostrados = ref();
const busqCliente = ref();
const nombre = ref();
const paterno = ref();
const materno = ref();
const idClienteEliminar = ref();

onMounted(async () => {
  await consultarClientes();
  setIdCliente(null);
});

const consultarClientes = async () => {
  try {
    const res = (await obtenerClientesActivos()).data.body;
    console.log(res);
    clientes.value = res;
    clientesMostrados.value = res;
  } catch (error) {
    console.log(error);
  }
};

function actualizarTabla() {
    let busqueda;
  if (busqCliente.value.trim() == "") {
    clientesMostrados.value = clientes.value;
  } else {
    busqueda = busqCliente.value.replace(/ /g, "");
    clientesMostrados.value = [];
    let nomCliente;
    console.log(clientes.value);
    clientes.value.forEach((element) => {
      nomCliente = element.Nombre + element.Apellido_Paterno + element.Apellido_Materno;

      if (nomCliente.toLowerCase().includes(busqueda.toLowerCase())) {
        clientesMostrados.value.push(element);
      }
    });
  }
}

function modificarCliente(id) {
  setIdCliente(id);
  router.push({ name: "actualizarCliente" });
}

async function mostrarModal(id, nombreP, paternoP, maternoP) {
  idClienteEliminar.value = id;
  nombre.value = nombreP;
  paterno.value = paternoP;
  materno.value = maternoP;
  var myModal = new bootstrap.Modal(document.getElementById("Modal"));
  myModal.show();
}

async function eliminarCliente() {
  await actualizarCliente({
    idClientes: idClienteEliminar.value,
    EstatusActividad_idEstatusActividad: 2,
  });
  await consultarClientes();
  busqCliente.value = "";

}
</script>
<template>
  <div class="container-fluid">
    <CompHeader />

    <div class="row">
      <div class="col-1 d-flex justify-content-end">
        <router-link to="/italika">
          <img
            class="img-fluid"
            style="margin-top: 9.2vh; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col mb-3 pt-5" >
        <div class="row align-items-end">
          <p class="italika ms-4" style="font-size: 50px">Clientes</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika ms-5 d-flex justify-content-start">Clientes registrados</h5>
        </div>
      </div>
      <div class="col-5 align-items-end pt-4" >
        <div class="row align-items-end pt-2 ps-5">
          <input
            id="myInput"
            v-on:keyup="actualizarTabla()"
            type="text"
            class="form-control rounded-pill mt-4"
            style=" height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
            v-model.trim="busqCliente"
          />
        </div>
        <div class="row">
          <div class="col-10">
            <h5 class="italika mt-3 d-flex justify-content-end">Agregar Clientes</h5>
          </div>

          <div class="col d-flex align-items-center justify-content-start">
            <router-link to="../crearCliente" style="text-decoration: none">
              <button
                class="btn btn-primary mt-2 d-flex align-items-center justify-content-center"
                type="button"
                style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;"
              >
                <h4>+</h4>
              </button>
            </router-link>
          </div>
          
        </div>
      </div>
      <div class="col-1"></div>
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
            <th scope="col">Apellido paterno</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <th scope="col">Apellido materno</th>
            <th scope="col">Teléfono</th>
            <th scope="col">No. Cliente BAZ</th>
            <th scope="col">Correo</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <th scope="col" class="sticky" style="position: sticky; right: 0">
              Opciones
            </th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientesMostrados" :key="cliente.idClientes">
            <td>{{ cliente.Nombre }}</td>
            <td>{{ cliente.Apellido_Paterno }}</td>
            <td>{{ cliente.Apellido_Materno }}</td>
            <td>{{ cliente.Telefono }}</td>
            <td v-if="!cliente.NoClienteBAZ == ''">{{ cliente.NoClienteBAZ }}</td>
            <td v-else><span class="badge bg-primary"> N/D </span></td>
            <td>{{ cliente.Correo }}</td>
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
                    @click="modificarCliente(cliente.idClientes)"
                  >
                    <img
                      class="img-fluid mb-3"
                      style="width: 100; height: 20px; margin-top: 0% !important"
                      src="../assets/lapiz.png"
                    />
                  </button>
                  <button
                    class="btn btn-primary d-inline-block btn-delete"
                    type="submit"
                    style="
                      background-color: #c01a1a;
                      border-color: #c01a1a;
                      height: 37px;
                      width: 45px;
                      margin-top: 0% !important;
                    "
                    @click="
                      mostrarModal(
                        cliente.idClientes,
                        cliente.Nombre,
                        cliente.Apellido_Paterno,
                        cliente.Apellido_Materno
                      )
                    "
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
  <!-- Modal -->
  <div
    class="modal fade"
    id="Modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Cliente</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          ¿Está seguro de eliminar al cliente "{{ nombre }} {{ paterno }} {{ materno }}"?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="eliminarCliente()">
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
.btn-delete:hover{
  background-color: #fc4d4d !important;
}

.btn-spacer {
  margin-right: 10px;
}
.btn-spacer:hover {
  margin-right: 10px;
  background-color: #ffef16 !important;
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

.btn-crear {
  background-color: #19aa66 !important;
}

.btn-crear:hover {
  /*background-color: #66d054 !important;*/
  background-color: #2ecc28 !important;
}
</style>

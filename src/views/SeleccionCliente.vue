<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { clientesStore } from "../stores/clientes";
import CompHeader from "../components/Header.vue";
import router from "../router";

const { setIdCliente, obtenerClientesActivos, getInterfazOrigen, setInterfazOrigen } = clientesStore();

const clientes = ref();
const clientesMostrados = ref();
const busqCliente = ref();

onMounted(async () => {
  getInterfazOrigen()==null? router.push({name:"home"}):
  await consultarClientes();

  setInterfazOrigen(null);
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

function actualizarTabla(busqueda) {

  if (busqueda.trim() == "") {
    clientesMostrados.value = clientes.value;
  } else {
    busqueda=busqueda.replace(/ /g, "")
    clientesMostrados.value = [];
    let nomCliente;
    console.log(clientes.value)
    clientes.value.forEach((element) => {
      nomCliente = element.Nombre + element.Apellido_Paterno + element.Apellido_Materno;

      if (nomCliente.toLowerCase().includes(busqueda.toLowerCase())) {
        clientesMostrados.value.push(element);
      }
    });
  }
}

function seleccionCliente(id){
     setIdCliente(id);
     console.log(id)
     const nameInterfaz =getInterfazOrigen(); 
     //setInterfazOrigen(null);
     router.back()
} 

</script>
<template>
  <div class="container-fluid">
    <CompHeader />

    <div class="row">
      <div class="col-1 mb-3 pt-5">
        <router-link to="/italika">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Clientes</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika d-flex justify-content-start">Seleccione un cliente</h5>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center align-items-center pt-2">
      <input
        type="text"
        class="form-control rounded-pill mt-4"
        style="width: 950px; height: 50px; border-color: #5e5e5e"
        placeholder="Buscar cliente"
        v-model="busqCliente"
        @input="actualizarTabla(busqCliente)"
      />
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
            <td scope="row" class="sticky" style="position: sticky">
              <div class="container">
                <div class="d-inline-flex">
                  <button
                    class="btn btn-primary d-inline-block mr-3 btn-spacerSelect"
                    type="submit"
                    style="
                      background-color: #61e450;
                      border-color: #08a148;
                      height: 37px;
                      width: 45px;
                    "
                    @click="seleccionCliente(cliente.idClientes)"
                  >
                    <i class="fa-solid fa-user-check" style="color: black"></i>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
.btn-spacerSelect {
  margin-right: 10px;
}
.btn-spacerSelect:hover {
  margin-right: 10px;
  background-color: #affaa5 !important;
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

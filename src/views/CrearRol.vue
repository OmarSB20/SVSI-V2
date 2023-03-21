<script setup>
import {ref} from "vue";
import axios from 'axios';
const prueba = ["Cotizaciones", "Prospectos", "Clientes", "Usuarios","Cotizaciones", "Prospectos", "Clientes", "Usuarios",];
const permisos = ref([1,2,3,4]);
const permiso = ref(3);

function agregarPermiso(permiso){
  permisos.value.push(permiso.value);
}

function eliminarPermiso(permiso){
  permisos.value = permisos.value.filter((item) => item !==permiso)
}

function consultar(){
axios.get('http://localhost:4000/api/clientes')
  .then(response => {
    // Aquí puedes hacer algo con la respuesta
    console.log(response.data);
  })
  .catch(error => {
    // Aquí manejas el error en caso de que la solicitud falle
    console.log(error);
  });}

</script>
<template>
  <form @submit.prevent="eliminarPermiso(permiso)">
    <div class="container-fluid">
      <div class="row mb-3 pt-5">
        <div class="col-1 d-flex justify-content-end">
          {{ permisos }}
          {{ permiso }}
          <img
            class="img-fluid"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </div>
        <div class="col ms-4">
          <p class="italika d-flex justify-content-start" style="font-size: 50px">
            Crear Rol
          </p>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Nombre del Rol:</h5>
        </div>
        <div class="col-6">
          <input type="text" class="form-control" style="" />
        </div>
        <div class="col">
          <button class="btn btn-primary" type="submit">Guardar</button>
        </div>
      </div>

      <div class="row">
        <div class="col ms-5 ps-5">
          <h5 class="italika" style="margin-left: 2.4%">
            Permisos a los que tiene acceso:
          </h5>
        </div>
        <div class="col-11"></div>
      </div>
      <div class="row">
        <div class="col-1"></div>
        <div class="col">
          <table
            class="table table-hover table-striped text-center mt-4 mx-auto"
            style="width: 900px"
          >
            <thead>
              <tr style="background-color: #2b4677; color: white">
                <th scope="col">Nombre de permiso</th>
                <th scope="col" style="width: 100px">Acceso</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in prueba">
                <td
                  style="
                    border-style: inherit;
                    border-right-color: #2b4677;
                    border-right-width: 2px;
                  "
                >
                  {{ item }}
                </td>
                <th scope="row">
                  <div class="form-check d-flex justify-content-center">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      style="width: 25px; height: 25px; border-color: #5e5e5e"
                    />
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-1"></div>
      </div>
    </div>
  </form>
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

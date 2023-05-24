<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { metaVentasStore } from "../stores/metaVentas";
import { usuariosStore } from "../stores/usuarios";

import CompHeader from "../components/Header.vue";
import router from "../router";

const { obtenerTodas  } = metaVentasStore();
const { obtenerUnUser } = usuariosStore();

const metas = ref();
const metasMostradas = ref();
const busqMeta = ref();


onMounted(async () => {
  await consultarMetas();

});

const consultarMetas = async () => {
  try {
    metas.value = await obtenerTodas();

    for(let item of metas.value){
      let empleado = await obtenerUnUser(item.Empleados_idEmpleados);
      empleado = empleado.data.body[0];
      item.Nombre = empleado.Nombre;
      item.Apellido_Paterno = empleado.Apellido_Paterno;
      item.Apellido_Materno = empleado.Apellido_Materno;
    }

    metasMostradas.value = metas.value;
  } catch (error) {
    console.log(error);
  }
};

function actualizarTabla() {
    let busqueda;
  if (busqMeta.value.trim() == "") {
    metasMostradas.value = metas.value;
  } else {
    busqueda = busqMeta.value.replace(/ /g, "");
    metasMostradas.value = [];
    let numSemana;
    metas.value.forEach((element) => {
      numSemana = element.NumSemana+"";
      if (numSemana.includes(busqueda)) {
        metasMostradas.value.push(element);
      }
    });
  }
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
          <p class="italika ms-4" style="font-size: 50px">Meta de ventas</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika ms-5 d-flex justify-content-start">Metas registradas</h5>
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
            v-model.trim="busqMeta"
          />
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
            <th scope="col">No. semana</th>
            <th scope="col">Fecha</th>
            <th scope="col">Meta</th>
            <th scope="col">Empleado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meta in metasMostradas" :key="meta.idMeta_De_Ventas">
            <td>{{ meta.NumSemana }}</td>
            <td>{{ meta.Fecha }}</td>
            <td>{{ meta.Meta }}</td>
            <td>{{ meta.Nombre }} {{ meta.Apellido_Paterno }} {{ meta.Apellido_Materno }}</td>
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

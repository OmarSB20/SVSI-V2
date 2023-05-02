<script setup>

import { ref } from "vue"; 
import { asesoresStore } from "../stores/asesores"; 
import { onMounted } from "vue"; 
import router from "../router";
import CompHeader from "../components/Header.vue";

const {obtenerAsesoresActivos ,obtenerTodos ,agregarAsesor, actualizarAsesor} = asesoresStore();
 
</script>

<template>
<div class="container-fluid">
    <CompHeader />
    <!------------------------------------------------ROW Titulo y busqueda----------------------------------------------->
    <div class="row">
      <div class="col-1 mb-3 pt-5 d-flex justify-content-end">
        <router-link to="/italika">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col-7 ms-4 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Asesores BAZ</p>
        </div>

      </div>
      <div class="col-3 align-items-end ps-5 ms-5">
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
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-2 mt-2 ms-5">
        <h5 class="italika d-flex justify-content-end">Tipo de crédito:</h5>
      </div>
      <div class="col-6 ms-4">
        <input
          type="text"
          ref="inputRol"
          class="form-control"
          @input="revisarCreditoExistente()"
          v-model="creditoNuevo"
        />
        <div
          v-if="repetido"
          class="alert alert-danger mt-2 d-flex align-items-center"
          style="height: 38px"
          role="alert"
        >
          "{{ creditoNuevo }}" ya existe
        </div>
      </div>
      <div class="col">
        <button
          v-if="!botonActualizar"
          class="btn btn-primary"
          type="submit"
          :disabled="deshabilitado"
          @click="guardarCreditos(creditoNuevo)"
        >
          Guardar
        </button>

        <button
          v-if="botonActualizar"
          class="btn btn-success"
          type="submit"
          :disabled="deshabilitado"
          @click="modificarCreditos(idBotonActualizar, creditoNuevo)"
        >
          Actualizar
        </button>
      </div>
    </div>
    <table
      class="table table-hover table-striped text-center mt-4 mx-auto"
      style="width: 900px"
    >
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Tipo de Crédito</th>
          <th scope="col" style="width: 200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="credito in creditosDesplegados">
          <td>
            {{ credito.Descripcion }}
          </td>
          <th scope="row">
            <div class="align-items-center">
            
              <button
                :id="credito.idTipos_De_Creditos"
                :class="[
                  botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos
                    ? 'btn btn-primary mx-1'
                    : 'btn btn-warning mx-1',
                ]"
                type="submit"
                style="border-color: #ffbe16; height: 37px"
                @click="
                  modificarNombreCredito(credito.Descripcion, credito.idTipos_De_Creditos)
                "
              >
                <i
                  :class="[
                    botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos
                      ? 'fa-solid fa-clock-rotate-left'
                      : 'fa-solid fa-pen-to-square',
                  ]"
                ></i>
              </button>

              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                @click="mostrarModalEliminar(credito.idTipos_De_Creditos, credito.Descripcion )"
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
</template>
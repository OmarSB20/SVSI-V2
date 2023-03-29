<script setup>
import {ref} from "vue";
import { permisosRolesStore } from "../stores/permisosRoles";
import { rolesStore } from "../stores/roles"; 
import { onMounted} from 'vue';

const {obtenerPermisosDelRol} = permisosRolesStore();
const {obtenerRoles} = rolesStore();
const {eliminarRol} = rolesStore();
const {obtenerRolesN} = rolesStore();
const {setRol} = rolesStore();

const rolDir = ref({});
const buscador = ref ({});
const roles = ref([]);
const rolesArray = ref([]);
const rolesDesplegados = ref([]);
const permisosDeRolArray = ref([]);
var modal;

onMounted(() => {
  consultarRoles();
  modal = new bootstrap.Modal(document.getElementById('modal'), {
  keyboard: false
})
})

const consultarRoles = async () => {
  buscador.value=[];
  rolesArray.value=[];
  rolDir.value=[];
  try{
    roles.value = await obtenerRoles();
    const body = roles.value.data.body;
    console.log(roles.value)
    for(var j in body){
      rolesArray.value.push(body[j]);
      buscador.value.push(body[j].Nombre);
      rolDir.value.push(body[j].idRoles)
    }
    rolesDesplegados.value = rolesArray.value;
  }catch(error){
    console.log(error)
  }
}


const consultarPermisosDeRol = async (idRol) => {
  
   permisosDeRolArray.value = [];
  try{
     const permisosDeRol = await obtenerPermisosDelRol(idRol);
    const body = permisosDeRol.data.body;
    for(var j in body) {
      permisosDeRolArray.value.push(body[j]);
      
    }
    modal.show()
  }catch(error){
    console.log(error)
  }
}

const eliminarRoles = async (idRol) => {
  try{
    await eliminarRol(idRol);
  }catch(error){
    console.log(error)
  }
}

const modificarRol = async (idRol) => {
  try{
    await setRol(idRol);
    this.$router.push("http://localhost:5173/crearRol");
  }catch(error){
console.log(error)
  }
}

function  actualizarTabla (nombre){
  if(nombre.trim() ==""){
    rolesDesplegados.value = rolesArray.value;
  }else{
    rolesDesplegados.value=[];
    rolesArray.value.forEach(element => {
      if (element.Nombre.includes(nombre)) {
        rolesDesplegados.value.push(element)
      }
    });
  }
}

</script>
<template>
    <div class="container-fluid" >
        <div class="row" style="background-color: black;" height="100px">
            <div class="col-10">

            </div>
            <div class="col">
                <p style="font-size: 60px" class="italika d-flex justify-content-start mb-0">SVSI</p>
            </div>
        </div>
        <div class="row">
            <div class="col-1">
              <a href = "http://localhost:5173">
                <img
                    class="img-fluid mt-3"
                    style="margin-top: 20px; width: 31.23px; height: 35.5px"
                    src="../assets/triangulito.png"
                />
              </a>
            </div>
            <div class="col-8">
                <div class="row align-items-end">
                    <p class="italika" style="font-size: 50px">
                        Roles
                    </p>
                </div>
                <div class="row align-items-end">
                    <h5 class="italika d-flex justify-content-start">
                        Registrar Roles
                    </h5>
                </div>
            </div>
            <div class="col-3 align-items-end">
                <div class="row align-items-end">
                    <input type="text" class="form-control rounded-pill mt-4" style="width: 250px; height: 50px; border-color: #5e5e5e"
                    placeholder="Buscar" v-model="nombre" @input="actualizarTabla(nombre)">
                </div>
                <div class="row">
                  <div class="col-6">
                    <h5 class="italika mt-3">
                        Agregar Roles
                    </h5>
                  </div>
                  <div class="col-1">
                    <router-link to="../crearRol">
                      <button class="btn btn-primary mt-2 d-flex align-items-center" type="submit"
                      style="background-color: #66D054; width: 40px; height: 40px; border-color: #5e5e5e"><h4>+</h4></button>
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
                <th scope="col" style="width: 100px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rol in rolesDesplegados">
                <td >
                {{ rol.Nombre }} 
                </td>
                <th scope="row" >
                  <div class="align-items-center">
                    <input class="btn btn-primary" type="submit"
                    style="background-color: #59C01A; border-color: #59C01A; height: 25px;"
                     @click="consultarPermisosDeRol(rol.idRoles)"/>
                    <input class="btn btn-primary ml-5" type="submit"
                    style="background-color: #FFBE16; border-color: #FFBE16; height: 25px;"
                     @click="modificarRol(rol.idRoles)"/>
                    <input class="btn btn-primary" type="submit"
                    style="background-color: #C01A1A; border-color: #C01A1A; height: 25px;"
                     @click="eliminarRoles(rol.idRoles)"/>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
    </div>

    <!-- Modal -->
<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Permisos del Rol</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div v-for="item in permisosDeRolArray">
          <span>{{ item.Descripcion }}</span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>
body{
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
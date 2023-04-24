<script setup>
import { ref } from "vue"; 
import { onMounted } from "vue";
import router from "../router";
import CompHeader from "../components/Header.vue";

//Declaracion de los constantes de los metodos de la store

//Variables reactivas
const idModelo = ref("");
const motosArray = ref([]);
const modeloNuevo = ref("");
const actualizar = ref(false);
const checksVacios = ref(false);
const validado = ref(true);
const alertaLlenado = ref(false);

var modal;

onMounted(async () => {
    console.log();
    await consultarMotos();
    await obtenerDatosMoto();
});

//Consultar todas las motos de la base de datos
const consultarMotos = async () => {
    try{

    } catch{

    }
};

//Obtener los datos de la moto segun su id (Actualizar)
const obtenerDatosMoto = async () => {
    try{

    } catch{

    }
};

//Consulta el id de la moto que se va a actualizar
function obtenerIdMoto (){

}

//Consultar si el modelo que se desea ingresar ya existe
function consultarModeloExistente() {
    
}

//Guarda una nueva moto
const crearModelo = async () => {
    try{

    } catch{

    }
}

//Actualiza una moto seleccionada
const actModelo = async () => {
    try{

    } catch{

    }
}

//Verifica los datos colocados
function sbmtMoto() {
    //Almenos uno de los 2 tiene que estar seleccionado
    const checkboxSi = document.getElementById("modifyP");
    const checkboxNo = document.getElementById("modifyP");
}

//Modifica el diseño y el funcionamiento del boton guardar
function modificarBoton() {

}

//Borra los campos cuando se vuelver a agregar nueva moto despes de
//actualizar
function resetCampos() {
  
}

//Actualiza la tabla segun lo que se coloque en el buscador
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

</script>

<template>
    <form @submit.prevent="sbmtMoto()" class="needs-validation" novalidate>
        <div class="container-fluid">
            <CompHeader/>
            <!-- Row de cabecera -->
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
                    Modelos Italika
                </p>
                </div>
                <div class="col-3 align-items-end ">
                    <div class="row align-items-end pt-2">
                        <input
                            type="text"
                            class="form-control rounded-pill"
                            style="width: 250px; height: 50px; border-color: #5e5e5e"
                            placeholder="Buscar"
                            v-model="nombre"
                            @input="actualizarTabla(nombre)"
                        />
                    </div>

                </div>
            </div>
            <div class="row mb-3 pt-1 d-flex align-items-center">
                <div class="col-1"></div>
                <div class="col-1 p-0">
                    <h5 class="italika m-0 p-3">Modelo:</h5>
                </div>
                <div class="col-4 p-0">
                    <input
                            type="text"
                            class="form-control rounded-pill"
                            style="width: 350px; height: 50px; border-color: #5e5e5e"
                            placeholder=""
                            v-model="modelo"
                            @input=""
                        />
                </div>
                <div class="col-2 m-0">
                    <div class="row align-items-center">
                        <h5 class="italika">Modelo disponible:</h5>
                    </div>
                    <div class="row align-items-center">
                        <div class="col p-0">
                            <h5 class="italika pt-2 m-1">Si</h5>
                        </div>
                        <div class="col p-0">
                            <input
                                type="checkbox"
                                @input="modificarC()"
                                id="modifyP"
                                style="width: 30px; height: 30px; border-color: #5e5e5e"
                                class="form-check-input"
                            />
                        </div>
                        <div class="col p-0">
                            <h5 class="italika pt-2 m-1">No</h5>
                        </div>
                        <div class="col p-0">
                            <input
                                type="checkbox"
                                @input="modificarC()"
                                id="modifyP"
                                style="width: 30px; height: 30px; border-color: #5e5e5e"
                                class="form-check-input"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="col-3 p-0">
                    <button
                        class="btn btn-primary rounded-pill"
                        style="width: 180px; height: 50px; background-color:#27D257"
                        type="submit"
                        :disabled="deshabilitado"
                    >
                        Guardar
                    </button>
                </div>
                <div class="col-1">

                </div>
            </div>
        </div>
    </form>
    <div class="container-fluid">
        <table
        class="table table-hover table-striped text-center mt-4 mx-auto"
        style="width: 900px"
        >
        <thead>
            <tr style="background-color: #2b4677; color: white; vertical-align: middle">
            <th scope="col">Modelo</th>
            <th scope="col">Modelo disponible</th>
            <th scope="col" class="sticky" style="position: sticky; right: 0">Opciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="moto in motosArray">
            <td>
                {{ moto.Nombre }}
            </td> 
            <td>
                {{ moto.Disponible }}
            </td> 
            <td>
                {{ moto.Disponible }}
            </td>
            <th scope="row" class="sticky" style="position: sticky">
                <div class="align-items-center">
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
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);
  min-height: 100vh;
}

#contraseña {
  display: none;
}

#contraseña2 {
  display: none;
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
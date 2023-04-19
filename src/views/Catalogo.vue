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
                            class="form-control rounded-pill mt-4"
                            style="width: 250px; height: 50px; border-color: #5e5e5e"
                            placeholder="Buscar"
                            v-model="nombre"
                            @input="actualizarTabla(nombre)"
                        />
                    </div>

                </div>
            </div>
        </div>
    </form>
</template>
<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { loginStore } from "../stores/login";
import router from "../router/index";

const { login } = loginStore();

const nickname = ref("");
const contrasena = ref("");
const deshabilitado = ref(true);
const aceptado = ref(true);
const vacios = ref(false);
const tipoInput = ref("password");
var tried = false;

var screenHeight = window.innerHeight;

window.addEventListener("resize", ajustarAlto);
function ajustarAlto() {
  screenHeight = window.innerHeight;
  const container = document.getElementById("main");
  screenHeight -= 140;
  container.style.height = screenHeight + "px";
}

onMounted(() => {
  deshabilitado.value = true;
  ajustarAlto();
});

function mostrarTexto(){
  tipoInput.value = "text";
}

function ocultarTexto(){
  tipoInput.value = "password";
}

function quitarEspacios() {
  nickname.value = nickname.value.trim();
  console.log(nickname.value);
}

function camposVacios() {
  if (tried && (nickname.value == "" || contrasena.value == "")) {
    vacios.value = true;
    return true;
  } else {
    vacios.value = false;
  }
  return false;
}

async function iniciarSesion() {
  tried = true;
  quitarEspacios();
  if (!camposVacios()) {
    try {
      var iniciado = await login({
        Usuario: nickname.value,
        Contrasena: contrasena.value,
      });
    } catch (error) {
      console.log(error);
    }
    if (iniciado) {
      console.log("iniciamos sesión");
      irMenu();
    } else {
      aceptado.value = false;
      console.log("quedamos");
    }
  }
}

function irMenu() {
  router.push({ name: "modificarRol" });
}
</script>

<template>
  <form @submit.prevent="iniciarSesion()">
    <div class="container-fluid">
      <!--------------------------------------  Cabecera --------------------------------->
      <div class="row d-flex align-items-center ms-5">
        <img
          class="img-fluid ms-5 mt-5"
          style="width: 335px; height: 80px"
          src="../assets/LogoItalikaRamos.png"
        />
      </div>
      <!-------------------------------------- cuerpo principal -------------------------------------------->
      <div class="row">
        <!--------------------------------------------Mitad izquierda------------------------------------>
        <div id="main" class="col d-flex align-items-center justify-content-center ms-5">
          <div
            id="carouselExampleIndicators"
            class="carousel slide w-75 h-75 rounded"
            data-bs-ride="carousel"
          >
            <div class="carousel-inner">
              <div class="carousel-item active" data-bs-interval="5000">
                <img src="../assets/250z.jpg" class="d-block w-100 rounded" alt="..." />
              </div>
              <div class="carousel-item" data-bs-interval="5000">
                <img
                  src="../assets/Voge_500R_61.jpeg"
                  class="d-block w-100 rounded"
                  alt="..."
                />
              </div>
              <div class="carousel-item" data-bs-interval="5000">
                <img src="../assets/ITALIKA-RT200.jpg" class="d-block w-100 rounded" alt="..." />
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                class="active rounded-circle"
                aria-current="true"
                aria-label="Slide 1"
                style="height: 20px; width: 20px"
              ></button>
              <button
                type="button"
                class="rounded-circle"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
                style="height: 20px; width: 20px"
              ></button>
              <button
                type="button"
                class="rounded-circle"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
                style="height: 20px; width: 20px"
              ></button>
            </div>
          </div>
        </div>
        <!--------------------------------------------Mitad derecha------------------------------------>
        <div class="col d-flex justify-content-center align-items-center">
          <div class="container w-75 rounded">
            <div class="row">
              <div class="col d-flex justify-content-center">
                <h1 class="italika mb-5" style="font-size: 50px; letter-spacing: 4px">
                  Iniciar Sesión
                </h1>
              </div>
            </div>
            <!----------------------------------------------Fila del nombre de usuario------------------------------------->
            <div class="row mb-5">
              <div class="col mt-2">
                <h3 class="italika">Usuario</h3>
              </div>
              <div>
                <input
                type="text"
                class="form-control input-f inptElement Drk"
                v-model.trim="nickname"
                @input="camposVacios()"
                autofocus
              />
              </div>
              
            </div>
            <!----------------------------------------------Fila de la contrasena------------------------------------->
            <div class="row">
              <div class="col mt-2">
                <h3 class="italika">Contraseña</h3>
              </div>
              <div class="input-group mb-3">
                <input
                  :type="tipoInput"
                  class="form-control input-f inptElement mb-4 Drk"
                  v-model.trim="contrasena"
                  @input="camposVacios()"
                />
                <button
                  class="btn btn-outline-secondary eyeBtn"
                  type="button"
                  id="button-addon2"
                  @mousedown="mostrarTexto()"
                  @mouseup="ocultarTexto()"
                >
                  <img
                    class="img-fluid"
                    style=""
                    src="../assets/eyeWhite.png"
                  />
                </button>
              </div>

              <div
                v-if="!aceptado"
                class="alert alert-danger d-flex align-items-center"
                style="height: 45px; font-size: 18px"
                role="alert"
              >
                Usuario y/o contraseña incorrectos
              </div>
              <div
                v-if="vacios"
                class="alert alert-danger d-flex align-items-center"
                style="height: 45px; font-size: 18px"
                role="alert"
              >
                Por favor, llene todos los campos
              </div>
            </div>
            <!-------------------------------------------------- Boton de iniciar sesion  ------------------------------>
            <div class="row">
              <button
                type="submit"
                class="btn btn-primary w-25 mx-auto mb-5"
                style="font-size: 18px; font-weight: 500; letter-spacing: 1.3px"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
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
.carousel-indicators {
  position: inherit !important;
}
.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
}

.Drk {
  height: 50px;
  font-size: 20px;
  background-color: #22242f;
  color: white;
  border-color: #22242f;
}

.Drk:focus {
  background-color: #22242f;
  border-color: #213ee2;
  color: white;
}

.eyeBtn {
  height: 50px;
  font-size: 20px;
  background-color: #22242f;
  border-color: #22242f;
}

.eyeBtn:hover {
  height: 50px;
  font-size: 20px;
  background-color: #22242f;
  border-color: #22242f;
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

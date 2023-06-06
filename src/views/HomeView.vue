<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { onUpdated } from "vue";
import { usuariosStore } from "../stores/usuarios";
import { loginStore } from "../stores/login";
import router from "../router/index";
import { metaVentasStore } from "../stores/metaVentas";

const { obtenerMetaActual, agregarMeta, actualizarMeta } = metaVentasStore();
const { verificarPermisos, getUser } = loginStore();
const { obtenerUnUser, obtenerIdPorUser } = usuariosStore();
const { reanudarSesion } = loginStore();
const { cerrarSesion } = loginStore();

const altoPantalla = ref(0);
const containerTag = ref(null);
const cantPermisos = ref(9);
const altoBtn = ref("20px");
const estadoBotones = ref([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);
const ventasActivo = ref(false);
const bancoActivo = ref(false);
const serviciosActivo = ref(false);
const tablaServiciosActivo = ref(false);
const tablaCitasActivo = ref(false);
const mjrVendedorActivo = ref(false);
const nickname = ref();
const metaVentas = ref("?");
const ventasPropias = ref(2);
const totalVentas = ref(5);
const totalServicios = ref(3);
const serviciosPropios = ref(2);
const mostrarTodo = ref(false);

const objMeta = ref(null);
const cantMeta = ref();

var modal;

onMounted(async () => {
  await definirPermisos();
  contarPermisos();
  consultarUsuarioAct();
  altoPantalla.value = screen.height - 73;

  containerTag.value.style.height = altoPantalla.value + "px";
  definirBotones();
  if (await verificarPermisos(3)) {
    await revisarMeta();
  }else{
    const res = await obtenerMetaActual();
    objMeta.value = res;
    cantMeta.value = objMeta.value.Meta;
    metaVentas.value = cantMeta.value;
  } 
  mostrarTodo.value = true;
});

async function revisarMeta() {
  const res = await obtenerMetaActual();
  if (!res) {
    modal = new bootstrap.Modal(document.getElementById("modalCrear"));
    modal.show();
  } else {
    objMeta.value = res;
    cantMeta.value = objMeta.value.Meta;

  }
  metaVentas.value = cantMeta.value;
}

async function crearMeta() {
  try {
    const idUser = await obtenerIdPorUser({Usuario: getUser()});
    const metaNueva = {
      idMeta_De_Ventas: 0,
      Empleados_idEmpleados: idUser,
      Fecha: new Date().toISOString().split('T')[0],
      Meta: cantMeta.value,
    };
    await agregarMeta(metaNueva);
    await revisarMeta();
  } catch (error) {
    console.log(error);
  }
}

async function actMeta() {
  try {
    const idUser = await obtenerIdPorUser({Usuario: getUser()});
    const metaNueva = {
      idMeta_De_Ventas: objMeta.value.idMeta_De_Ventas,
      Empleados_idEmpleados: idUser,
      Fecha: objMeta.value.Fecha,
      Meta: cantMeta.value,
    };
    await actualizarMeta(metaNueva);
    await revisarMeta();
  } catch (error) {
    console.log(error);
  }
}

const definirPermisos = async () => {
  for (let i = 0; i < estadoBotones.value.length; i++) {
    try {
      const result = await verificarPermisos(i + 1);
      if (result) {
        estadoBotones.value[i] = result.accepted;
        nickname.value = result.user;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const consultarUsuarioAct = async () => {
  try {
    const nickActual = getUser();
    let usuarioActual = await obtenerIdPorUser({ Usuario: nickActual });
    usuarioActual = await obtenerUnUser(usuarioActual);
    usuarioActual = usuarioActual.data.body[0];
  } catch (error) {
    console.log(error);
  }
};

function definirBotones() {
  altoBtn.value = (screen.height - 190) / cantPermisos.value;
  ventasActivo.value = false;
  bancoActivo.value = false;
  serviciosActivo.value = false;
  for (let i = 0; i <= 3; i++) {
    if (estadoBotones.value[i] == true) {
      ventasActivo.value = true;
    }
  }

  for (let i = 4; i <= 6; i++) {
    if (estadoBotones.value[i] == true) {
      bancoActivo.value = true;
    }
  }

  estadoBotones.value[7] == true
    ? (serviciosActivo.value = true)
    : (serviciosActivo.value = false);
  estadoBotones.value[12] == true
    ? (tablaCitasActivo.value = true)
    : (tablaCitasActivo.value = false);

  if (!ventasActivo.value && serviciosActivo) {
    mjrVendedorActivo.value = false;
    tablaServiciosActivo.value = true;
  } else {
    mjrVendedorActivo.value = true;
  }
}

function contarPermisos() {
  let cont = 0;
  for (let i = 7; i < estadoBotones.value.length; i++) {
    if (estadoBotones.value[i]) {
      cont++;
    }
  }
  cantPermisos.value = cont;
}

async function logOut() {
  await cerrarSesion();
  redirigir("login");
}

function redirigir(interfaz) {
  router.push({ name: interfaz });
}
</script>

<template>
  <div v-show="mostrarTodo" class="container-fluid body2" ref="containerTag">
    <div class="row">
      <!------------------------------------------------AREA IZQUIERDA MENU----------------------------------------------------------->
      <div class="col-3 ps-0">
        <div class="row pb-2">
          <img
            class="img-fluid ms-3 mt-1"
            style="width: 335px; height: 100%"
            src="../assets/LogoItalikaRamos.png"
          />
        </div>
        <div class="row ps-4 overflow-auto scrollPers" style="height: 580px">
          <div
            class="accordion accordion-flush"
            id="accordionFlushExample"
            style="color: chartreuse !important"
          >
            <!-------------------------------------------------AREA VENTAS---------------------------------------------------------   -->
            <div v-if="ventasActivo" class="accordion-item">
              <h2 class="accordion-header" id="flush-headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                  :style="{ height: altoBtn + 'px' }"
                >
                  Area de ventas
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="flush-headingTwo"
                data-bs-parent="#accordionFlushExample"
              >
                <div class="">
                  <button
                    v-if="estadoBotones[0]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    type="button"
                    @click="redirigir('prospectos')"
                    :style="{ height: altoBtn + 'px', borderTopWidth: '5px' }"
                  >
                    Prospectos
                  </button>
                  <button
                    v-if="estadoBotones[1]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    type="button"
                    @click="redirigir('cotizaciones')"
                    :style="{ height: altoBtn + 'px' }"
                  >
                    Cotizaciones
                  </button>
                  <button
                    v-if="estadoBotones[2]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    type="button"
                    @click="redirigir('mediosContacto')"
                    :style="{ height: altoBtn + 'px' }"
                  >
                    Medios de contacto
                  </button>
                  <button
                    v-if="estadoBotones[3]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalActualizar"
                    :style="{ height: altoBtn + 'px', borderBottomWidth: '5px' }"
                  >
                    Meta de ventas
                  </button>
                </div>
              </div>
            </div>
            <!-------------------------------------------------AREA BANCO---------------------------------------------------------   -->
            <div v-if="bancoActivo" class="accordion-item">
              <h2 class="accordion-header" id="flush-headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseThree"
                  aria-expanded="false"
                  aria-controls="flush-collapseThree"
                  :style="{ height: altoBtn + 'px' }"
                >
                  Banco
                </button>
              </h2>
              <div
                id="flush-collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="flush-headingThree"
                data-bs-parent="#accordionFlushExample"
              >
                <div class="">
                  <button
                    v-if="estadoBotones[4]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    @click="redirigir('asesores')"
                    type="button"
                    :style="{ height: altoBtn + 'px', borderTopWidth: '5px' }"
                  >
                    Asesores BAZ
                  </button>
                  <button
                    v-if="estadoBotones[5]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    @click="redirigir('estatusCotizacion')"
                    type="button"
                    :style="{ height: altoBtn + 'px' }"
                  >
                    Estatus de cotización
                  </button>
                  <button
                    v-if="estadoBotones[6]"
                    class="noAccordionBtn w-100 ps-5 d-flex justify-content-start align-items-center"
                    @click="redirigir('creditos')"
                    type="button"
                    :style="{ height: altoBtn + 'px', borderBottomWidth: '5px' }"
                  >
                    Tipos de creditos
                  </button>
                </div>
              </div>
            </div>
            <!-------------------------------------------------SERVICIOS---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[7]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('servicios')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Servicios
            </button>
            <!-------------------------------------------------AREA Usuarios---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[8]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('usuarios')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Usuarios
            </button>
            <!-------------------------------------------------AREA Clientes---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[9]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('clientes')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Clientes
            </button>
            <!-------------------------------------------------AREA Motos---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[10]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('catalogo')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Catálogo
            </button>
            <!-------------------------------------------------AREA roles---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[13]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('roles')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Roles
            </button>
            <!-------------------------------------------------AREA citas---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[12]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('citas')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Citas
            </button>
            <!-------------------------------------------------AREA reportes---------------------------------------------------------   -->
            <button
              v-if="estadoBotones[11]"
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              @click="redirigir('reportes')"
              type="button"
              :style="{ height: altoBtn + 'px' }"
            >
              Reportes
            </button>
            <!-------------------------------------------------AREA reportes---------------------------------------------------------   -->
            <button
              class="noAccordionBtn w-100 ps-4 d-flex justify-content-start align-items-center"
              type="button"
              @click="logOut()"
              :style="{ height: altoBtn + 'px' }"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      <!---------------------------------------------------Area derecha-------------------------------------------------------------------------------->
      <div class="col">
        <!---------------------------------------------------Row de Bienvenida--------------------------------- -->
        <div class="row">
          <p class="saludo d-flex justify-content-center mt-3 mb-0">
            Bienvenido {{ nickname }}
          </p>
        </div>
        <!---------------------------------------------------Row de datos de ventas--------------------------------- -->
        <div v-if="ventasActivo" class="row w-75 m-auto">
          <div class="col">
            <div class="container roundedPanel mt-3 w-75">
              <div class="seccionSm text-center">
                <p style="padding-top: 11px; margin-bottom: 0px">Meta de ventas:</p>
                <p>{{ metaVentas }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="container roundedPanel mt-3 w-75">
              <div class="seccionSm text-center">
                <p style="padding-top: 11px; margin-bottom: 0px">Tus ventas:</p>
                <p style="margin-bottom: 0px">{{ ventasPropias }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="container roundedPanel mt-3 w-75">
              <div class="seccionSm text-center">
                <p style="padding-top: 11px; margin-bottom: 0px">Ventas totales:</p>
                <p>{{ totalVentas }}</p>
              </div>
            </div>
          </div>
        </div>
        <!---------------------------------------------------Row de datos de servicios--------------------------------- -->
        <div v-if="serviciosActivo" class="row w-75 m-auto">
          <div class="col">
            <div class="container roundedPanel mt-1 w-75">
              <div class="seccionSm text-center">
                <p style="padding-top: 11px; margin-bottom: 0px">Servicios totales:</p>
                <p style="margin-bottom: 5px">{{ totalServicios }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="container roundedPanel mt-1 w-75">
              <div class="seccionSm text-center">
                <p style="padding-top: 11px; margin-bottom: 0px">Tus servicios:</p>
                <p style="margin-bottom: 5px">{{ serviciosPropios }}</p>
              </div>
            </div>
          </div>
        </div>
        <!---------------------------------------------------Row Vendedor de la semana--------------------------------- -->
        <div v-if="mjrVendedorActivo" class="row w-75 m-auto">
          <div class="container roundedPanel mt-3">
            <div class="row">
              <div class="col-2">
                <img
                  class="d-flex justify-content-center m-auto"
                  src="../assets/Medalla.png"
                  style="height: 6.5vw"
                />
              </div>
              <div class="col">
                <div class="empleadoMesTitulo">Vendedor de la semana</div>
                <div class="empleadoMes">Luis Gerardo Subealdea Hernandez</div>
              </div>
            </div>
          </div>
        </div>
        <!---------------------------------------------------Row servicios en progreso----------------------------------->
        <div v-if="tablaServiciosActivo" class="row w-75 m-auto">
          <div class="container roundedPanel mt-1">
            <div class="d-flex justify-content-center mt-3">
              <p class="pillCal rounded-pill px-5 d-inline-block">
                Servicios en progreso
              </p>
            </div>
            <div class="d-flex justify-content-center">
              <div style="width: 10px; background-color: red; margin-bottom: 25px"></div>
              <p class="cita px-3 w-75">Miercoles 7 de junio - Chuy Malboro Malboro</p>
            </div>
            <div class="d-flex justify-content-center">
              <div
                style="width: 10px; background-color: #d4c324; margin-bottom: 25px"
              ></div>
              <p class="cita px-3 w-75">Jueves 8 de junio - Chuy Malboro Malboro</p>
            </div>
            <div class="d-flex justify-content-center">
              <div
                style="width: 10px; background-color: green; margin-bottom: 25px"
              ></div>
              <p class="cita px-3 w-75">Viernes 11 de junio - Chuy Malboro Malboro</p>
            </div>
          </div>
        </div>
        <!---------------------------------------------------Row citas pendientes----------------------------------->
        <div v-if="tablaCitasActivo" class="row w-75 m-auto">
          <div class="container roundedPanel mt-3">
            <div class="d-flex justify-content-center mt-3">
              <p class="pillCal rounded-pill px-5 d-inline-block">Citas próximas</p>
            </div>
            <div class="d-flex justify-content-center">
              <div style="width: 10px; background-color: red; margin-bottom: 25px"></div>
              <p class="cita px-3 w-75">Jueves 8 de junio - Omar Suarez Barajas</p>
            </div>
            <div class="d-flex justify-content-center">
              <div
                style="width: 10px; background-color: #d4c324; margin-bottom: 25px"
              ></div>
              <p class="cita px-3 w-75">Lunes 12 de junio - Dulce Alicia Tovar Mendoza</p>
            </div>
            <div class="d-flex justify-content-center">
              <div
                style="width: 10px; background-color: green; margin-bottom: 25px"
              ></div>
              <p class="cita px-3 w-75">Jueves 22 de junio - Omar Suarez Barajas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal  Crear-->
  <div
    class="modal fade"
    id="modalCrear"
    data-bs-backdrop="static"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Definir meta de esta semana</h5>
        </div>
        <div class="modal-body">
          <div>Meta de la semana</div>
          <div><input class="form-control" type="number" v-model.trim="cantMeta" /></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="crearMeta()" :disabled="cantMeta<1" data-bs-dismiss="modal">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--------------modalActualizar----------->
  <div
    class="modal fade"
    id="modalActualizar"
    data-bs-backdrop="static"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Meta de la semana</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>Meta actual</div>
          <div><input class="form-control" type="number" v-model="cantMeta" /></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="redirigir('metaVentas')" data-bs-dismiss="modal">
            ver metas
          </button>
          <button type="button" class="btn btn-success" @click="actMeta()" :disabled="cantMeta<1" data-bs-dismiss="modal">
            Actualizar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.body2 {
  background-image: linear-gradient(
    90.01deg,
    #000103 25.4%,
    #143a83 80.87%,
    #164193 90.92%
  );
}

.noAccordionBtn {
  background-color: #000103 !important;
  color: white !important;
  font-size: 2.092vw;
  border-bottom-color: white;
  border-bottom-width: 3px;
  border-left-width: 0px;
  border-right-width: 0px;
  font-family: "Fjalla One";
  font-style: normal;
  letter-spacing: 0.04em;
  max-height: 100px;
}

.accordion-button {
  font-family: "Fjalla One";
  font-style: normal;
  letter-spacing: 0.04em;
  background-color: #000103 !important;
  color: white !important;
  font-size: 2.5vw;
  max-height: 100px;
}

.intern-accordion-button {
  font-family: "Fjalla One";
  font-style: normal;
  letter-spacing: 0.04em;
  background-color: #021741 !important;
  color: white !important;
  font-size: 2.5vw;
  max-height: 100px;
}

/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/

.scrollPers::-webkit-scrollbar {
  -webkit-appearance: none;
}

.scrollPers::-webkit-scrollbar:vertical {
  width: 10px;
}

.scrollPers::-webkit-scrollbar-button:increment,
.scrollPers::-webkit-scrollbar-button {
  display: none;
}

.scrollPers::-webkit-scrollbar:horizontal {
  height: 10px;
}

.scrollPers::-webkit-scrollbar-thumb {
  background-color: #5c5c5c;
  border-radius: 20px;
}

.scrollPers::-webkit-scrollbar-track {
  border-radius: 10px;
}

.roundedPanel {
  background-color: rgba(91, 117, 137, 0.31);
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.7) inset;
  border-radius: 30px;
}

.pillCal {
  background-color: white;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.59) inset;
  font-family: "Fjalla One";
  font-size: 1.7vw;
  margin-bottom: 2%;
}

.cita {
  background-color: white;
  font-family: "Fjalla One";
  font-size: 1.7vw;
  border-radius: 0px 10px 10px 0px;
  margin-bottom: 2.5%;
}

.empleadoMesTitulo {
  margin-top: 7px;
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  font-size: 1.6vw;
  line-height: 38px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.04em;
  color: #ffffff;
}

.empleadoMes {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  font-size: 5vh;
  line-height: 52px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.04em;
  color: #6aff79;
}

.saludo {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  font-size: 3vw;
  line-height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.04em;
  color: #ffffff;
}

.seccionSm {
  font-family: "Fjalla One";
  font-size: 1.5vw;
  color: white;
}

.accordion-button:after {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
}
</style>

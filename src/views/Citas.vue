<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { clientesStore } from "../stores/clientes";
import { CitasStore } from "../stores/citas";
import { loginStore } from "../stores/login";
import { rolesStore } from "../stores/roles";
import { usuariosStore } from "../stores/usuarios";
import CompHeader from "../components/Header.vue";
import router from "../router";

const {
  agregarCita,
  obtenerTodos,
  obtenerUno,
  setDia,
  getDia,
  setCita,
  getCita,
  actualizarCita,
  eliminarCita,
} = CitasStore();
const {
  obtenerCliente,
  setIdCliente,
  getIdCliente,
  setInterfazOrigen,
  getAccionPas,
  setAccionPas,
} = clientesStore();
const { getUser } = loginStore();
const { obtenerIdPorUser, obtenerUnUser } = usuariosStore();
const { obtenerRolesN } = rolesStore();

const alertaLlenar = ref(false);

const calendar = ref(null);
const date = ref(null);
const daysContainer = ref(null);
const prev = ref(null);
const next = ref(null);
const habilitado = ref(true);
const tagCrear = ref(null);
const alertarepetida = ref(false);

const diasMostrados = ref([]);
const eventosMostrados = ref([]);
const citasMes = ref([]);

const idCliente = ref("");
const nombreCliente = ref("");
const inptHora = ref("");

const nombreClienteAct = ref("");
const inptHoraAct = ref("");
const idActualizar = ref("");

const nickActual = ref("");
const superUsuario = ref(false);
const tagSelect = ref(null);
const citaActualizar = ref(null);
const citasHoy = ref(null);

const idCitaEliminar = ref();
const puedeCrear = ref(false);

const tituloFecha = ref("");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

let posDiaActivo;
var diaGuard;

var modal;

const estatus = ["Pendiente", "Atendida", "Sin asistencia", "Cancelada"];

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

onMounted(async () => {
  await consultarUsuarioAct();
  await initCalendar();
  const accPas = getAccionPas();
  if (accPas) {
    if (accPas == "crearCita") {
      modal = new bootstrap.Modal(document.getElementById("exampleModal"), {
        keyboard: false,
      });

      await cargarDatosGuardar();
    } else {
      modal = await new bootstrap.Modal(document.getElementById("ModalAct"), {
        keyboard: false,
      });
      await cargarDatosAct();
    }
  }
});

const consultarUsuarioAct = async () => {
  try {
    nickActual.value = getUser();
    let usuarioActual = await obtenerIdPorUser({ Usuario: nickActual.value });
    usuarioActual = await obtenerUnUser(usuarioActual);
    usuarioActual = usuarioActual.data.body[0];

    let nivelUsuario = await obtenerRolesN(usuarioActual.Roles_idRoles);
    nivelUsuario = nivelUsuario.data.body[0].SuperRol;

    nivelUsuario == 1 ? (superUsuario.value = true) : (superUsuario.value = false);
  } catch (error) {
    console.log(error);
  }
};

async function consultarCliente() {
  let cliente = await obtenerCliente(getIdCliente());
  setIdCliente(null);
  setInterfazOrigen(null);
  cliente = cliente.data.body[0];
  const nombreCompleto =
    cliente.Nombre + " " + cliente.Apellido_Paterno + " " + cliente.Apellido_Materno;
  return { id: cliente.idClientes, nombre: nombreCompleto };
}

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
async function initCalendar() {
  await obtenerCitasMes();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.value = months[month] + " " + year;
  diasMostrados.value = [];

  let days = "";
  //Dias pasados
  for (let x = day; x > 0; x--) {
    let mesPas = month - 1;
    let anoAct = year;
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    if (mesPas < 0) {
      mesPas = 11;
      anoAct = year - 1;
    }
    diasMostrados.value.push({
      dia: prevDays - x + 1,
      mes: mesPas,
      ano: anoAct,
      estilo: "day prev-date",
      citas: [],
    });
  }

  //Dias presentes
  let citasDia;
  let citaFormat;
  for (let i = 1; i <= lastDate; i++) {
    citasDia = [];
    citaFormat = new Date(year, month, i);
    citaFormat = citaFormat.toLocaleDateString();
    citaFormat = citaFormat.replaceAll("/", "-");
    const ano = citaFormat.substring(citaFormat.length - 4);
    citaFormat = citaFormat.replace(ano, "");

    let dia;
    if (citaFormat.substring(0, 2).includes("-")) {
      dia = "0" + citaFormat.substring(0, 1);
      citaFormat = citaFormat.substring(1);
    } else {
      dia = citaFormat.substring(0, 2);
      citaFormat = citaFormat.substring(2);
    }
    if (citaFormat.length == 3) {
      citaFormat = citaFormat.replace("-", "-0");
    }
    citaFormat = ano + citaFormat + dia;

    let citaAprove = citasMes.value.filter((cita) => {
      return cita.fecha.slice(0, -9) == citaFormat;
    });

    citaAprove.forEach(async (item) => {
      item.hora = item.fecha.slice(11, item.fecha.length - 3);
      console.log(item.hora)
      item.fecha = item.fecha.slice(0, -9);
      const client = await obtenerCliente(item.Clientes_idClientes);
      item.Nombre = client.data.body[0].Nombre;
      item.Apellido_Paterno = client.data.body[0].Apellido_Paterno;
      item.Apellido_Materno = client.data.body[0].Apellido_Materno;
    });

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      days += `<div class="day today active">${i}</div>`;

      if (citaAprove.length == 0) {
        posDiaActivo =
          diasMostrados.value.push({
            dia: i,
            mes: month,
            ano: year,
            estilo: "day today active",
          }) - 1;
      } else {
        posDiaActivo =
          diasMostrados.value.push({
            dia: i,
            mes: month,
            ano: year,
            estilo: "day today active",
            citas: citaAprove,
          }) - 1;
      }
    } else {
      days += `<div class="day">${i}</div>`;
      if (citaAprove.length == 0) {
        diasMostrados.value.push({
          dia: i,
          mes: month,
          ano: year,
          estilo: "day",
        });
      } else {
        diasMostrados.value.push({
          dia: i,
          mes: month,
          ano: year,
          estilo: "day",
          citas: citaAprove,
        });
      }
    }
  }
  //Dias futuros
  for (let j = 1; j <= nextDays; j++) {
    let mesFut = month + 1;
    let anoAct = year;
    if (mesFut > 11) {
      mesFut = 0;
      anoAct = year + 1;
    }
    diasMostrados.value.push({
      dia: j,
      mes: mesFut,
      ano: anoAct,
      estilo: "day next-date",
      citas: [],
    });
    days += `<div class="day next-date">${j}</div>`;
  }
  printDate(posDiaActivo);
  //daysContainer.value.innerHTML = days;
}

async function obtenerCitasMes() {
  citasMes.value = [];
  let citas = await obtenerTodos();
  citas = citas.data.body;

  for (let element of citas) {
    let emp = await obtenerUnUser(element.Empleados_idEmpleados);
    emp = emp.data.body[0];
    if (superUsuario.value || emp.Usuario.trim() == nickActual.value.trim()) {
      citasMes.value.push(element);
    }
  }
}

async function selecCliente(accionPas) {
  if (accionPas == "actualizarCita") {
    setCita(citaActualizar.value);
  } else {
    setCita(null);
    setDia(posDiaActivo);
    inptHora.value = "";
  }
  setInterfazOrigen("citas");
  setAccionPas(accionPas);
  //modal.hide();
  router.push({ name: "seleccionCliente" });
}
//----------------Metodos para proceso de guardar ------------
async function cargarDatosGuardar() {
  const indice = getDia();
  setDia(null);
  const clienteSeleccionado = await consultarCliente();
  printDate(indice);
  idCliente.value = clienteSeleccionado.id;
  nombreCliente.value = clienteSeleccionado.nombre;
  inptHora.value = "";
  await modal.show();
}

async function guardarCita() {
  if (inptHora.value == "" || nombreCliente.value == "") {
    alertaLlenar.value = true;
  } else {
    let fechaTemp = diasMostrados.value[posDiaActivo];
    const mesAg = fechaTemp.mes + 1;
    fechaTemp = fechaTemp.ano + "-" + mesAg + "-" + fechaTemp.dia;
    const user = getUser();
    const emp = await obtenerIdPorUser({ Usuario: user });
    let citaRepetida=false;
    if(citasHoy.value){
    citasHoy.value.forEach(element => {
    if(element.hora==inptHora.value){
      citaRepetida = true;
    }
  
  });}
  if (!citaRepetida) {
    alertarepetida.value=false;
    const cita = {
      idCitas: 0,
      Clientes_idClientes: idCliente.value,
      Empleados_idEmpleados: emp,
      fecha: fechaTemp + " " + inptHora.value,
      estatusCita: 1,
    };
    const indiceDia = posDiaActivo;
    await agregarCita(cita);
    await initCalendar();
    printDate(indiceDia);

    modal.hide();
  }else{
    alertarepetida.value=true;
  }
    
  }
}
//----------------Metodos para proceso de actualizar ------------
async function preActualizar(cita, pos, idEliminar) {
  idCitaEliminar.value = idEliminar;
  citaActualizar.value = cita;
  citaActualizar.value.posicion = posDiaActivo;
  idActualizar.value = cita.idCitas;
  idCliente.value = cita.Clientes_idClientes;
  let clienteAct = await obtenerCliente(cita.Clientes_idClientes);
  clienteAct = clienteAct.data.body[0];
  nombreClienteAct.value =
    clienteAct.Nombre +
    " " +
    clienteAct.Apellido_Paterno +
    " " +
    clienteAct.Apellido_Materno;
  inptHoraAct.value = cita.hora;
  tagSelect.value.value = cita.estatusCita;
  modal = new bootstrap.Modal(document.getElementById("ModalAct"), {
    keyboard: false,
  });
  await modal.show();
}

async function cargarDatosAct() {
  citaActualizar.value = getCita();
  setCita(null);
  printDate(citaActualizar.value.posicion);
  const clienteSeleccionado = await consultarCliente();
  if (clienteSeleccionado) {
    idCliente.value = clienteSeleccionado.id;
    nombreClienteAct.value = clienteSeleccionado.nombre;
  } else {
    idCliente.value = citaActualizar.value.Clientes_idClientes;
  }

  // idCliente.value = clienteSeleccionado.id;
  // nombreClienteAct.value = clienteSeleccionado.nombre;
  inptHoraAct.value = citaActualizar.value.hora;
  tagSelect.value.value = citaActualizar.value.estatusCita;
  await modal.show();
}

async function actualizarCitas() {
  if (inptHoraAct.value == "" || nombreClienteAct.value == "") {
    alertaLlenar.value = true;
  } else {
    let fechaTemp = diasMostrados.value[posDiaActivo];
    const mesAg = fechaTemp.mes + 1;
    fechaTemp = fechaTemp.ano + "-" + mesAg + "-" + fechaTemp.dia;


    let citaRepetida=false;
    citasHoy.value.forEach(element => {
      console.log(element.hora==inptHoraAct.value)
      console.log(element.fecha)
      console.log(element.idCitas)
      console.log(citaActualizar.value.idCitas)
      if (citaActualizar.value.idCitas!= element.idCitas) {
        if(element.hora==inptHoraAct.value){

        citaRepetida = true;
    }
  
  }
  });
  if (!citaRepetida) {
    alertarepetida.value=false;
    const cita = {
      idCitas: citaActualizar.value.idCitas,
      Clientes_idClientes: idCliente.value,
      Empleados_idEmpleados: citaActualizar.value.Empleados_idEmpleados,
      fecha: fechaTemp + " " + inptHoraAct.value,
      estatusCita: tagSelect.value.value,
    };
    const indiceDia = posDiaActivo;
    await actualizarCita(cita);
    await initCalendar();
    printDate(indiceDia);
    await modal.hide();
  }else{
    alertarepetida.value=true;
  }
   
  }
}

//metodos de utilidad
//function to add month and year on prev and next button
async function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  await initCalendar();
}

async function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  await initCalendar();
}

async function irHoy() {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  await initCalendar();
  printDate(posDiaActivo);
}
//selecciona un día segun su indice y carga sus citas
function printDate(indice) {
  diasMostrados.value[posDiaActivo].estilo = "day";
  diasMostrados.value[indice].estilo = "day today active ";
  posDiaActivo = indice;
  eventosMostrados.value = diasMostrados.value[posDiaActivo].citas;

  alertaLlenar.value = false;
  nombreCliente.value = "";
  inptHora.value = "";

  let hoy = new Date();
  let seleccionada = new Date(
    diasMostrados.value[posDiaActivo].ano +
      "/" +
      (diasMostrados.value[posDiaActivo].mes + 1) +
      "/" +
      diasMostrados.value[posDiaActivo].dia
  );
  hoy = hoy.toISOString().split("T")[0];
  seleccionada = seleccionada.toISOString().split("T")[0];

  citasHoy.value = diasMostrados.value[posDiaActivo].citas;

  habilitado.value = hoy <= seleccionada;

  if (!habilitado.value) {
    tagCrear.value.style.backgroundColor = "gray";
  } else {
    tagCrear.value.style.backgroundColor = "#00ff1f";
  }

  tituloFecha.value =
    diasMostrados.value[posDiaActivo].dia +
    "/" +
    diasMostrados.value[posDiaActivo].mes +
    "/" +
    diasMostrados.value[posDiaActivo].ano;
}

async function eliminar() {
  await eliminarCita(idCitaEliminar.value);
  await initCalendar();
  printDate(posDiaActivo);
}
</script>

<template>
  <CompHeader style="width: 100.7% !important" />
  <div class="container">
    <div class="col-1 d-flex justify-content-center">
      <router-link to="/italika">
        <img
          class="img-fluid"
          style="margin-top: 9.2vh; width: 31.23px; height: 35.5px"
          src="../assets/triangulito.png"
        />
      </router-link>
    </div>
    <div class="left">
      <div class="calendar" ref="calendar">
        <div class="month">
          <i class="fas fa-angle-left prev" ref="prev" @click="prevMonth()"></i>
          <div class="date">{{ date }}</div>
          <i class="fas fa-angle-right next" ref="next" @click="nextMonth()"></i>
        </div>
        <div class="weekdays">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mie</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sab</div>
        </div>
        <div class="days" ref="daysContainer">
          <div v-for="(dia, index) in diasMostrados">
            <div :class="dia.estilo" @click="printDate(index)">
              <div class="ms-2 mt-2 dia">{{ dia.dia }}</div>
              <div class="d-inline-block mx-1" v-for="(cita, index2) in dia.citas">
                <i v-if="index2 < 5" class="fa-solid fa-motorcycle"></i>
                <i v-if="index2 == 5" class="fa-solid fa-plus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="goto-today d-flex justify-content-center">
          <button class="today-btn" @click="irHoy()">Hoy</button>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="today-date">
        <div class="event-day">Citas</div>
        <div class="event-date">{{ tituloFecha }}</div>
      </div>
      <div class="events" v-for="(evento, index3) in eventosMostrados">
        <div
          class="event d-flex align-items-center"
          @click="preActualizar(evento, index3, evento.idCitas)"
        >
          <div>
            <i class="fa-solid fa-motorcycle" style="font-size: 50px"></i>
          </div>
          <div class="event-text">
            {{ evento.hora }} - {{ evento.Nombre }} {{ evento.Apellido_Paterno }}
            {{ evento.Apellido_Materno }}
            <span v-if="evento.estatusCita == 1" class="badge bg-primary">Pendiente</span>
            <span v-if="evento.estatusCita == 2" class="badge bg-success">Atendida</span>
            <span v-if="evento.estatusCita == 3" class="badge bg-warning"
              >Sin asistencia</span
            >
            <span v-if="evento.estatusCita == 4" class="badge bg-danger">Cancelada</span>
          </div>
        </div>
      </div>
      <div class="add-event-wrapper">
        <div class="add-event-header">
          <div class="title">Add Event</div>
          <i class="fas fa-times close"></i>
        </div>
        <div class="add-event-body">
          <div class="add-event-input">
            <input type="text" placeholder="Event Name" class="event-name" />
          </div>
          <div class="add-event-input">
            <input type="text" placeholder="Event Time From" class="event-time-from" />
          </div>
          <div class="add-event-input">
            <input type="text" placeholder="Event Time To" class="event-time-to" />
          </div>
        </div>
        <div class="add-event-footer">
          <button
            class="add-event-btn"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
    <button
      class="add-event"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      :disabled="!habilitado"
      ref="tagCrear"
    >
      <i class="fas fa-plus"></i>
    </button>
  </div>
  <datalist id="listahorasdeseadas">
    <option value="7:00"></option>
    <option value="8:00"></option>
    <option value="9:00"></option>
    <option value="10:00"></option>
    <option value="11:00"></option>
    <option value="12:00"></option>
    <option value="13:00"></option>
    <option value="14:00"></option>
    <option value="15:00"></option>
    <option value="16:00"></option>
    <option value="17:00"></option>
    <option value="18:00"></option>
    <option value="19:00"></option>
  </datalist>

  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Crear cita</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row mx-auto w-50 mb-2">
            <button
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
              @click="selecCliente('crearCita')"
            >
              seleccionar cliente
            </button>
          </div>
          <div class="row d-flex align-items-center">
            <div class="col-2">Cliente</div>
            <div class="col">
              <input
                type="text"
                class="form-control"
                disabled
                v-model="nombreCliente"
                required
              />
            </div>
          </div>
          <div class="row d-flex justify-content-center align-items-center">
            <div class="col-2">Hora</div>
            <div class="col">
              <input
                class="form-control mt-2"
                v-model="inptHora"
                type="time"
                id="appt"
                name="appt"
                min="07:00"
                max="19:00"
                list="listahorasdeseadas"
                required
              />
            </div>
          </div>
          <div v-if="alertaLlenar" class="alert alert-danger mt-2" role="alert">
            Por favor llene todos los campos.
          </div>
          <div v-if="alertarepetida" class="alert alert-danger mt-2" role="alert">
            Ya hay una cita registrada a esta hora.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="guardarCita()">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Actualizar -->
  <div
    class="modal fade"
    id="ModalAct"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Actualizar cita</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row mx-auto w-50 mb-2">
            <button
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
              @click="selecCliente('actualizarCita')"
            >
              seleccionar cliente
            </button>
          </div>
          <div class="row d-flex align-items-center">
            <div class="col-2">Cliente</div>
            <div class="col">
              <input
                type="text"
                class="form-control"
                disabled
                v-model="nombreClienteAct"
                required
              />
            </div>
          </div>
          <div class="row d-flex justify-content-center align-items-center">
            <div class="col-2">Hora</div>
            <div class="col">
              <input
                class="form-control mt-2"
                v-model="inptHoraAct"
                type="time"
                id="appt"
                name="appt"
                min="07:00"
                list="listahorasdeseadas"
                max="19:00"
                required
              />
            </div>
          </div>
          <div class="row d-flex justify-content-center align-items-center">
            <div class="col-2">Estatus</div>
            <div class="col">
              <select class="form-select mt-2" ref="tagSelect">
                <option value="1">Pendiente</option>
                <option value="2">Atendida</option>
                <option value="3">Sin asistencia</option>
                <option value="4">Cancelada</option>
              </select>
            </div>
          </div>
          <div v-if="alertaLlenar" class="alert alert-danger mt-2" role="alert">
            Por favor llene todos los campos.
          </div>
          <div v-if="alertarepetida" class="alert alert-danger mt-2" role="alert">
            Ya hay una cita registrada a esta hora.
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#elimModal"
          >
            Eliminar cita
          </button>
          <button type="button" class="btn btn-primary" @click="actualizarCitas()">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- elimModal -->
  <div
    class="modal fade"
    id="elimModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Eliminar cita</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">¿Está seguro de eliminar esta cita?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="eliminar()"
            data-bs-dismiss="modal"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.calendar {
  --primary-clr: #1c2d64;
}

.inptTime {
  width: 100%;
  height: 38px;
  border-radius: 0.375rem;
}
/*
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}*/
/* nice scroll bar */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #808080;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb {
  background: var(--primary-clr);
  border-radius: 50px;
}

/*
body {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
  
}*/
.container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 700px;
  margin: 0 auto;
  padding-inline: 5px;
  color: #ffffff;
  display: flex;
  border-radius: 10px;
  background-color: #4e4e4eab;
}
.left {
  width: 56%;
  padding: 20px;
}
.calendar {
  position: relative;
  width: 630px;
  /*height: 100%;*/
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /*justify-content: space-between;*/
  color: #22263d;
  border-radius: 5px;
  background-color: #ffffff;
}
/* set after behind the main element */
.calendar::before,
.calendar::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  width: 12px;
  height: 97%;
  border-radius: 0 5px 5px 0;
  background-color: #d3d4d6d7;
  transform: translateY(-50%);
}
.calendar::before {
  height: 94%;
  left: calc(100% + 12px);
  background-color: rgb(153, 153, 153);
}
.calendar .month {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: capitalize;
  color: white;
  background-color: rgb(29, 28, 28);
}
.calendar .month .prev,
.calendar .month .next {
  cursor: pointer;
}
.calendar .month .prev:hover,
.calendar .month .next:hover {
  color: var(--primary-clr);
}
.calendar .weekdays {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: rgb(29, 28, 28);

  color: white;
}
.weekdays div {
  width: 14.28%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar .days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0px;
}
.calendar .days .day {
  width: 90px;
  height: 90px;
  cursor: pointer;
  color: var(--primary-clr);
  border: 2px solid #000000;
}
.calendar .days:nth-child(7n + 1) {
  border-left: 2px solid #000000 !important;
}
.calendar .days .day:nth-child(7n + 1) {
  border-left: 2px solid #ffffff;
}
.calendar .days .day:nth-child(7n) {
  border-right: 2px solid #000000;
}
.calendar .days .day:nth-child(-n + 7) {
  border-top: 2px solid #ffffff;
}
.calendar .days .day:nth-child(n + 29) {
  border-bottom: 2px solid #f5f5f5;
}

.calendar .days .day:not(.prev-date, .next-date):hover {
  color: #fff;
  background-color: var(--primary-clr);
}
.calendar .days .prev-date,
.calendar .days .next-date {
  color: #555555;
}
.calendar .days .active {
  position: relative;

  color: #fff;
  background-color: var(--primary-clr);
}
.calendar .days .active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px 2px var(--primary-clr);
}
.calendar .days .today .dia {
  font-size: 1.3rem;
}
.calendar .days .event {
  position: relative;
}
.calendar .days .event::after {
  content: "";
  position: absolute;
  bottom: 10%;
  left: 50%;
  width: 75%;
  height: 6px;
  border-radius: 30px;
  transform: translateX(-50%);
  background-color: var(--primary-clr);
}
.calendar .days .day:hover.event::after {
  background-color: #fff;
}
.calendar .days .active.event::after {
  background-color: #fff;
  bottom: 20%;
}
.calendar .days .active.event {
  padding-bottom: 10px;
}
.calendar .goto-today {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-top: 20px;
  padding: 0 20px 20px;
  margin-bottom: 2px;
  color: var(--primary-clr);
}
.calendar .goto-today .goto {
  display: flex;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--primary-clr);
}
.calendar .goto-today .goto input {
  width: 100%;
  height: 30px;
  outline: none;
  border: none;
  border-radius: 5px;
  padding: 0 20px;
  color: var(--primary-clr);
  border-radius: 5px;
}
.calendar .goto-today button {
  padding: 5px 10px;
  border: 1px solid var(--primary-clr);
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
  color: var(--primary-clr);
}
.calendar .goto-today button:hover {
  color: #fff;
  background-color: var(--primary-clr);
}
.calendar .goto-today .goto button {
  border: none;
  border-left: 1px solid var(--primary-clr);
  border-radius: 0;
}
.container .right {
  position: relative;
  width: 40%;
  min-height: 100%;
  padding: 20px 0;
}

.right .today-date {
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  padding-left: 70px;
  margin-top: 50px;
  margin-bottom: 20px;
  text-transform: capitalize;
  background-color: #323233;
}
.right .today-date .event-day {
  font-size: 2rem;
  font-weight: 500;
}
.right .today-date .event-date {
  font-size: 1rem;
  font-weight: 400;
  color: #ffffff;
}
/*
.events {
  width: 100%;
  height: 100%;
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-left: 4px;
}*/
.events .event {
  position: relative;
  width: 100%;
  min-height: 70px;
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 0 20px;
  padding-left: 50px;
  margin-right: 0px !important;
  color: #fff;
  background: linear-gradient(90deg, #3f4458, transparent);
  cursor: pointer;
}
/* even event */
.events .event:nth-child(even) {
  background: transparent;
}
.events .event:hover {
  background-color: #000000;
}
.events .event .title {
  display: flex;
  align-items: center;
  pointer-events: none;
}
.events .event .title .event-title {
  font-size: 1rem;
  font-weight: 400;
  margin-left: 20px;
}
.events .event i {
  color: var(--primary-clr);
  font-size: 0.5rem;
}
.events .event:hover i {
  color: #fff;
}
.events .event .event-time {
  font-size: 0.8rem;
  font-weight: 400;
  color: #878895;
  margin-left: 15px;
  pointer-events: none;
}
.events .event:hover .event-time {
  color: #fff;
}
/* add tick in event after */
.events .event::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  font-size: 3rem;
  line-height: 1;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  margin-right: 30px;
  color: var(--primary-clr);
  transform: translateY(-50%);
  background-color: #000000;
}
.events .event:hover::after {
  display: flex;
}
.add-event {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #ffffff;
  border: 2px solid #ffffff;
  opacity: 0.5;
  border-radius: 50%;
  background-color: #00ff1f;
  cursor: pointer;
}
.add-event:hover {
  opacity: 1;
}
.add-event i {
  pointer-events: none;
}
.events .no-event {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 500;
  color: #878895;
}
.add-event-wrapper {
  position: absolute;
  bottom: 100px;
  left: 50%;
  width: 90%;
  max-height: 0;
  overflow: hidden;
  border-radius: 5px;
  background-color: #fff;
  transform: translateX(-50%);
  transition: max-height 0.5s ease;
}
.add-event-wrapper.active {
  max-height: 300px;
}
.add-event-header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: #373c4f;
  border-bottom: 1px solid #f5f5f5;
}
.add-event-header .close {
  font-size: 1.5rem;
  cursor: pointer;
}
.add-event-header .close:hover {
  color: var(--primary-clr);
}
.add-event-header .title {
  font-size: 1.2rem;
  font-weight: 500;
}
.add-event-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
}
.add-event-body .add-event-input {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.add-event-body .add-event-input input {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid #f5f5f5;
  padding: 0 10px;
  font-size: 1rem;
  font-weight: 400;
  color: #373c4f;
}
.add-event-body .add-event-input input::placeholder {
  color: #a5a5a5;
}
.add-event-body .add-event-input input:focus {
  border-bottom: 1px solid var(--primary-clr);
}
.add-event-body .add-event-input input:focus::placeholder {
  color: var(--primary-clr);
}
.add-event-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.add-event-footer .add-event-btn {
  height: 40px;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  border: none;
  color: #fff;
  background-color: var(--primary-clr);
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid var(--primary-clr);
}
.add-event-footer .add-event-btn:hover {
  background-color: transparent;
  color: var(--primary-clr);
}

/* media queries */

@media screen and (max-width: 1000px) {
  body {
    align-items: flex-start;
    justify-content: flex-start;
  }
  .container {
    min-height: 100vh;
    flex-direction: column;
    border-radius: 0;
  }
  .container .left {
    width: 100%;
    height: 100%;
    padding: 20px 0;
  }
  .container .right {
    width: 100%;
    height: 100%;
    padding: 20px 0;
  }
  .calendar::before,
  .calendar::after {
    top: 100%;
    left: 50%;
    width: 97%;
    height: 12px;
    border-radius: 0 0 5px 5px;
    transform: translateX(-50%);
  }
  .calendar::before {
    width: 94%;
    top: calc(100% + 12px);
  }
  .events {
    padding-bottom: 340px;
  }
  .add-event-wrapper {
    bottom: 100px;
  }
}
@media screen and (max-width: 500px) {
  .calendar .month {
    height: 75px;
  }
  .calendar .weekdays {
    height: 50px;
  }
  .calendar .days .day {
    height: 40px;
    font-size: 0.8rem;
  }
  .calendar .days .day.active,
  .calendar .days .day.today {
    font-size: 1rem;
  }
  .right .today-date {
    padding: 20px;
  }
}

.credits {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 10px;
  font-size: 12px;
  color: #fff;
  background-color: #b38add;
}
.credits a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
.credits a:hover {
  text-decoration: underline;
}

.event-text {
  width: 80%;
  margin-left: 30px;
}
</style>

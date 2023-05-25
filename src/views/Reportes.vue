<script setup>
import { ref } from "vue";
import CompHeader from "../components/Header.vue";
import { onMounted } from "vue";
import { jsPDF } from "jspdf";
//Para Tablas de prospectos, citas y cotizaciones
import { usuariosStore } from "../stores/usuarios";
import { catalogoStore } from "../stores/catalogo";
import { clientesStore } from "../stores/clientes";
import { prospectosStore } from "../stores/prospectos";
import { loginStore } from "../stores/login";
import { rolesStore } from "../stores/roles";
import { mediosContactoStore } from "../stores/mediosContacto";
import { CitasStore } from "../stores/citas";
import { cotizacionesStore } from "../stores/cotizaciones";
import { asesoresStore } from "../stores/asesores";
import { creditosStore } from "../stores/creditos";
import { estatusCotizacionStore } from "../stores/estatusCotizacion";
import { cotizacionMotoStore } from "../stores/cotizacionMoto";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { setIdUsuario } = usuariosStore();
const { agregarUsuario } = usuariosStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();

const { traerCotizacionMotos } = cotizacionMotoStore();
const { verificarPermisos } = loginStore();
const { obtenerEstatusCotizacionN } = estatusCotizacionStore();
const { obtenerAsesor } = asesoresStore();

const { cotizacionExiste } = cotizacionesStore();
const { obtenerCotizaciones } = cotizacionesStore();
const { obtenerCotizacion } = cotizacionesStore();
const { agregarCotizacion } = cotizacionesStore();
const { setIdCotizacion } = cotizacionesStore();
const { eliminarCotizacion } = cotizacionesStore();
const { obtenerCreditosN } = creditosStore();

const { obtenerRolesN } = rolesStore();
const { obtenerUnUser, obtenerIdPorUser } = usuariosStore();
const { consultarMotocicletas, obtenerUnModelo } = catalogoStore();
const { obtenerCliente, obtenerTodosClientes } = clientesStore();
const { obtenerProspectos, setIdProspecto, eliminarProspecto } = prospectosStore();
const { getUser } = loginStore();
const { obtenerMediosN, obtenerMedios } = mediosContactoStore();

const { obtenerTodos } = CitasStore();
//variables reactivas
const cotizaciones = ref({});
//const roles = ref([]);
//const arrayNicknames = ref([]);
const deshabilitado = ref(true);
//para buscar
const cotizacionesFiltradas = ref({});
const cotizacionAct = ref("");
const idUsuarioAct = ref("");
const cotizacionFiltrados = ref([]);
const cotizacion = ref([]);
const busqueda = ref("");
const idCotizacioneliminar = ref("");

const cotizacionArray = ref([]); //arreglo que guarda las cotizaciones que se mostraran en la tabla
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const arregloCotizacionesAux = ref([]);

const cotizacionesMostradas = ref([]);

//Variables Prospectos
const nickActual = ref();
const nivelUsuario = ref([]);
const prospectos = ref([]);
const prospectosFiltrados = ref([]);
const prospectosDesplegados = ref([]);
const usuarioActual = ref("Lupillo");
const clientes = ref([]);
const motos = ref([]);
const mediosContacto = ref([]);
const superUsuario = ref(false);
const idProspectoEl = ref();
const tablaLista = ref(false);
var sc;
//variables citas
const citas = ref([]);
const citasFiltradas = ref([]);
const citasDesplegadas = ref([]);
var xdes;

//Variables de Reportes--------
//datos cabecera de reporte
const nombreUsuario = ref("");
const nombreEmpleadoUsuario = ref("");
const rolUsuario = ref("");
const todayDate = ref("");
const fechaInicialFormatted = ref("");
const fechaFinalFormatted = ref("");

const fechaInicial = ref("");
const fechaFinal = ref("");
const tipoReporte = ref("");

const tagProspectos = ref(null);
const tagCotizaciones = ref(null);
const tagCitas = ref(null);
const tagHTML = ref(null);
const tagIframe = ref(null);
const array = ref(["1", "2", "3", "4"]);
const alertFechaReporte = ref(false);
const alertIncDatos = ref(false);
const sinDatos = ref(true);
var cargando = ref(false);

//Metodos para cotizaciones

async function iniciarCotizacion() {
  await consultarUsuarioAct();

  await consultarTodo();
}

const consultarTodo = async () => {
  try {
    cotizacionArray.value = [];
    cotizacionesMostradas.value = [];
    arregloCotizacionesAux.value = [];
    let todas = await obtenerCotizaciones();
    todas = todas.data.body;
    console.log(todas);
    for (let item of todas) {
      let motos = [];
      var cotizacionesMotos = await traerCotizacionMotos();

      cotizacionesMotos.forEach((element) => {
        if (element.Cotizaciones_idCotizaciones == item.idCotizaciones) {
          motos.push(element.Moto_idMoto);
        }
      });
      item.motos = motos;
      arregloCotizacionesAux.value.push(item);
    }
    console.log("ActualActualActualActualActualActualActualActualActualActual");

    console.log(arregloCotizacionesAux.value);

    for (let element of arregloCotizacionesAux.value) {
      console.log("Hola");
      var cotizacion = await obtenerCotizacion(element.idCotizaciones); //asigna cada elememento a cada cotizacion
      cotizacion = cotizacion.data.body[0];
      console.log(cotizacion);

      cotizacion.usuario = await obtenerUnUser(cotizacion.Empleados_idEmpleados);
      cotizacion.usuario = cotizacion.usuario.data.body[0].Usuario;

      console.log(cotizacion.usuario);
      console.log(nickActual.value);
      if (!(superUsuario.value || cotizacion.usuario == nickActual.value)) {
        return;
      }

      var cliente = await obtenerCliente(cotizacion.Clientes_idClientes);
      cliente = cliente.data.body[0];

      var tipoCredito = await obtenerCreditosN(
        cotizacion.Tipos_De_Creditos_idTipos_De_Creditos
      );
      tipoCredito = tipoCredito.data.body[0];

      var estatus = await obtenerEstatusCotizacionN(
        cotizacion.EstatusCotizacion_idEstatusCotizacion
      );
      estatus = estatus.data.body[0];

      var asesor = await obtenerAsesor(cotizacion.AsesoresBAZ_idAsesoresBAZ);
      asesor = asesor.data.body[0];

      var motos = [];
      for (const moto of element.motos) {
        var motoData = await obtenerUnModelo(moto);
        motos.push(motoData.data.body);
      }

      // console.log(moto);

      //para juntar todo
      const objetoCotizacion = await {
        idCotizaciones: cotizacion.idCotizaciones,
        NoClienteBAZ: cliente.NoClienteBAZ,
        Nombre: cliente.Nombre,
        Apellido_Paterno: cliente.Apellido_Paterno,
        Apellido_Materno: cliente.Apellido_Materno,
        DescripcionCredito: tipoCredito.Descripcion,
        DescripcionEstatus: estatus.Descripcion,
        usuario: cotizacion.usuario,
        Motos: motos,
        NombreAsesorBAZ: asesor.Nombre,
        Telefono: cliente.Telefono,
        Correo: cliente.Correo,
        PagoInicial: cotizacion.PagoInicial,
        Capacidad: cotizacion.Capacidad,
        FechaRegistro: cotizacion.FechaRegistro,
        FechaVisita: cotizacion.FechaVisita,
        HoraInicial: cotizacion.HoraInicial,
        HoraFinal: cotizacion.HoraFinal,
        FechaVenta: cotizacion.FechaVenta,
        Comentario: cotizacion.Comentario,
      };
      console.log(objetoCotizacion);
      // console.log(objetoCotizacion);
      await cotizacionArray.value.push(objetoCotizacion); //agregar objeto al arreglo, lo hace una vez para cada objeto, a fin de cuentas termina haciendolo para todos los objetos
      console.log(cotizacionArray.value);
    }
    console.log(cotizacionArray.value);
    cotizacionesMostradas.value = cotizacionArray.value;
      tablaLista.value = true;

    console.log(cotizacionesMostradas.value);
  } catch (error) {
    console.log(error);
  }
};

//Metodos de reportes                ------------------------------------
onMounted(async () => {
  await obtenerDatosUsuarioActual();
  todayDate.value = formatearFecha("");
});

async function obtenerDatosUsuarioActual() {
  nombreUsuario.value = getUser();
  let userFull = await obtenerIdPorUser({ Usuario: nombreUsuario.value });
  userFull = await obtenerUnUser(userFull);
  userFull = userFull.data.body[0];

  nombreEmpleadoUsuario.value =
    userFull.Nombre +
    " " +
    userFull.Apellido_Paterno +
    " " +
    userFull.Apellido_Materno +
    " ";

  rolUsuario.value = await obtenerRolesN(userFull.Roles_idRoles);
  rolUsuario.value = rolUsuario.value.data.body[0].Nombre;
}

function formatearFecha(fechaBase) {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  let fecha;
  if (fechaBase == "") {
    fecha = new Date();
  } else {
    fecha = new Date(fechaBase);
    fecha.setDate(fecha.getDate() + 1);
  }

  return (
    fecha.getDate() + " de " + meses[fecha.getMonth()] + " de " + fecha.getUTCFullYear()
  );
}

async function revFechas() {
  if (fechaInicial.value == "" || fechaFinal.value == "" || tipoReporte.value == "") {
    alertIncDatos.value = true;
    return;
  }
  alertIncDatos.value = false;

  fechaInicialFormatted.value = formatearFecha(fechaInicial.value);
  fechaFinalFormatted.value = formatearFecha(fechaFinal.value);

  console.log(fechaInicialFormatted.value);
  console.log(fechaFinalFormatted.value);

  const ini = new Date(fechaInicial.value);
  const fin = new Date(fechaFinal.value);
  const resta = fin.getTime() - ini.getTime();

  if (resta < 0) {
    alertFechaReporte.value = true;
    return;
  }

  alertFechaReporte.value = false;
  await asignarHTML();
}

async function asignarHTML() {
  sc= 0.35;
  if (tipoReporte.value == 2) {
    xdes = -5;
    sc=0.33;
    await iniciarCotizacion();
    tagHTML.value = tagCotizaciones.value;
  } else if (tipoReporte.value == 1) {
    tagHTML.value = tagProspectos.value;
    xdes = 20;
    await iniciarProspecto();
  } else {
    tagHTML.value = tagCitas.value;
    xdes = 40;
    await iniciarCita();
  }
  cargando.value = true;

    await generarPDF();
}

async function generarPDF() {
  sinDatos.value = false;
  var doc = new jsPDF("p", "px");
  tagHTML.value.style.display = "inline-block";
  let pdfData2;
  await doc.html(tagHTML.value, {
    callback: async function (doc) {
      var pageCount = doc.internal.getNumberOfPages();
      doc.deletePage(pageCount);
      doc.deletePage(pageCount - 1);
      doc.deletePage(pageCount - 2);
      doc.deletePage(pageCount - 3);
      doc.deletePage(pageCount - 4);
        pdfData2 = await doc.output("datauristring");
        cargando.value = false;
        tagIframe.value.src = pdfData2;
    },
    x: xdes,
    y: 0,
    html2canvas: { scale: sc, x: -55, y: 0 },
  });

  //tagHTML.value.style.display = "none";
}

//Metodos de citas                ------------------------------------

async function iniciarCita() {
  citas.value = await obtenerTodos();
  citas.value = citas.value.data.body;
  console.log(citas.value);
  await consultarUsuarioAct();
  await filtrarCitas();
}

async function filtrarCitas() {
  let cliente, nombre, paterno, materno;
  citasFiltradas.value = [];
  for (let element of citas.value) {
    const usuarioCita = await obtenerUnUser(element.Empleados_idEmpleados);

    nombre = usuarioCita.data.body[0].Nombre;
    paterno = usuarioCita.data.body[0].Apellido_Paterno;
    materno = usuarioCita.data.body[0].Apellido_Materno;

    element.Empleados_idEmpleados = nombre + " " + paterno + " " + materno;

    cliente = await obtenerCliente(element.Clientes_idClientes);

    nombre = cliente.data.body[0].Nombre;
    paterno = cliente.data.body[0].Apellido_Paterno;
    materno = cliente.data.body[0].Apellido_Materno;

    element.Clientes_idClientes = nombre + " " + paterno + " " + materno;

    switch (element.estatusCita) {
      case 1:
        element.estatusCita = "Pendiente";
        break;
      case 2:
        element.estatusCita = "Atendida";
        break;
      case 3:
        element.estatusCita = "Sin asistencia";
        break;
      case 4:
        element.estatusCita = "Cancelada";
        break;
    }

    const ini = new Date(fechaInicial.value);
    const fin = new Date(fechaFinal.value);

    let fecha = element.fecha;
    element.fecha = fecha.substring(0, 10);
    console.log(element.fecha);
    element.hora = fecha.substring(12, 19);
    const reg = new Date(fecha);

    if (
      (superUsuario.value || usuarioCita.Usuario == nickActual.value) &&
      reg.getTime() >= ini.getTime() &&
      reg.getTime() <= fin.getTime()
    ) {
      console.log(element.fecha);
      citasFiltradas.value.push(element);
    }
    citasDesplegadas.value = citasFiltradas.value;
  }

  tablaLista.value = true;
}

//Metodos de prospectos                ------------------------------------

async function iniciarProspecto() {
  motos.value = await consultarMotocicletas();
  motos.value = motos.value.data.body;
  clientes.value = await obtenerTodosClientes();
  clientes.value = clientes.value.data.body;
  mediosContacto.value = await obtenerMedios();
  mediosContacto.value = mediosContacto.value.data.body;
  await consultarUsuarioAct();
  await montarProspectos();
}

//saber si es superusuario
const consultarUsuarioAct = async () => {
  try {
    nickActual.value = getUser();
    usuarioActual.value = await obtenerIdPorUser({ Usuario: nickActual.value });
    usuarioActual.value = await obtenerUnUser(usuarioActual.value);
    usuarioActual.value = usuarioActual.value.data.body[0];

    nivelUsuario.value = await obtenerRolesN(usuarioActual.value.Roles_idRoles);
    nivelUsuario.value = nivelUsuario.value.data.body[0].SuperRol;

    console.log("super usuario? " + nivelUsuario.value);

    nivelUsuario.value == 1 ? (superUsuario.value = true) : (superUsuario.value = false);
    console.log(superUsuario.value);
  } catch (error) {
    console.log(error);
  }
};

const montarProspectos = async () => {
  prospectosFiltrados.value = [];

  prospectos.value = await obtenerProspectos();
  prospectos.value = prospectos.value.data.body;

  let cliente;
  for (let element of prospectos.value) {
    element.usuario = await obtenerUnUser(element.Empleados_idEmpleados);

    const nombre = element.usuario.data.body[0].Nombre;
    const paterno = element.usuario.data.body[0].Apellido_Paterno;
    const materno = element.usuario.data.body[0].Apellido_Materno;

    element.usuario = nombre + " " + paterno + " " + materno;

    element.moto = await obtenerUnModelo(element.Moto_idMoto);
    element.moto = element.moto.data.body[0].Modelo;

    element.medio = await obtenerMediosN(element.MedioDeContacto_idMedioDeContacto);
    element.medio = element.medio.data.body[0].Descripcion;

    cliente = await obtenerCliente(element.Clientes_idClientes);
    cliente = cliente.data.body[0];

    //en teoria estas lineas crean nuevas propiedades en el objeto
    element.nombre = cliente.Nombre;
    element.paterno = cliente.Apellido_Paterno;
    element.materno = cliente.Apellido_Materno;
    element.telefono = cliente.Telefono;
    element.noBAZ = cliente.NoClienteBAZ;
    element.correo = cliente.Correo;

    //borramos la propiedad del idClientes que ya no necesitamos

    delete element.idClientes;

    const ini = new Date(fechaInicial.value);
    const fin = new Date(fechaFinal.value);
    const reg = new Date(element.Fecha_registro);

    if (
      (superUsuario.value || element.usuario == nickActual.value) &&
      reg.getTime() >= ini.getTime() &&
      reg.getTime() <= fin.getTime()
    ) {
      prospectosFiltrados.value.push(element);
    }
    prospectosDesplegados.value = prospectosFiltrados.value;
  }

  tablaLista.value = true;
};
</script>
<template>
  <!------------------------------------CONTENEDOR PRINCIPAL REPORTES------------------------------------->
  <div class="container-fluid m-0">
    <!------------------------------------ROW TITULO------------------------------------->
    <CompHeader />
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
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Reportes</p>
        </div>
      </div>
    </div>
    <!------------------------------------ROW PDF Y BOTONES------------------------------------->
    <div class="row">
      <!----------------------------------- AREA VISTA PREVIA---------------------------------------------------------->
      <div class="col-8">
        <div class="contPDF">
          <div v-if="sinDatos" class="container-fluid" style="margin-left: 30%">
            <div class="row">
              <h1>No hay datos disponibles</h1>
            </div>
            <div class="row">
              <i
                class="fa-regular fa-file-excel"
                style="color: #d0d1d2; font-size: 40vh"
              ></i>
            </div>
          </div>
          <img
            v-if="cargando"
            class="fa-spin"
            src="../assets/tire.png"
            style="width: 100px; height: 100px"
          />
          <iframe v-show="!cargando" class="framePDF" ref="tagIframe"> </iframe>
        </div>
      </div>
      <!----------------------------------- AREA BOTONES---------------------------------------------------------->
      <div class="col">
        <div class="row mt-5 mb-4">
          <div class="col-4 italika">Tipo de reporte</div>
          <div class="col">
            <select class="form-select" v-model="tipoReporte">
              <option value="1">Prospectos</option>
              <option value="2">Cotizaciones</option>
              <option value="3">Citas</option>
            </select>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-3 italika">Fecha inicial</div>
          <div class="col">
            <input class="form-control" type="date" v-model="fechaInicial" />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-3 italika">Fecha final</div>
          <div class="col">
            <input class="form-control" type="date" v-model="fechaFinal" />
          </div>
        </div>
        <div>
          <div v-show="alertFechaReporte" class="alert alert-danger" role="alert">
            ¡La fecha final no puede ser antes de la fecha inicial!
          </div>
          <div v-show="alertIncDatos" class="alert alert-warning" role="alert">
            Por favor, llene todos los datos correctamente.
          </div>
        </div>
        <div class="row">
          <button class="btn btn-success w-50 m-auto" @click="revFechas()">
            Generar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!------------------------------------------------------- DIV QUE OCULTA LOS REPORTES --------------------------------------------------------->
  <div style="display: none">
    <!------------------------------------------------------- Cotizaciones  --------------------------------------------------------->
    <div class="temp-target" ref="tagCotizaciones">
      <div class="container mt-5 ms-0" style="text-align: center">
        <div class="row mb-5">
          <div class="col">
            <img src="src\assets\italikaReportes.png" class="img-fluid logoReportes" />
          </div>
          <div
            class="col"
            style="display: flex; justify-content: end; align-items: center"
          >
            <h5><strong>Fecha : </strong>{{ todayDate }}</h5>
          </div>
        </div>
        <div class="row">
          <h2 style="font-weight: bold">Distribuidora Italika Ramos Arizpe</h2>
        </div>
        <div class="row"><h3 style="font-weight: bold">Reporte de Cotizaciones</h3></div>
        <div class="row">
          <h5>
            Melchor Ocampo #305 Zona Centro Ramos Arizpe Coahuila, México. C.P 25900
          </h5>
        </div>
        <div class="row"><h5>Teléfono: 8441145047</h5></div>
        <div class="row">
          <h5>Elaborado por: {{ rolUsuario }} {{ nombreEmpleadoUsuario }}</h5>
        </div>
        <div class="row" style="text-align: end">
          <h5>Periodo: {{ fechaInicialFormatted }} - {{ fechaFinalFormatted }}</h5>
        </div>
      </div>
      <table
        id="myTable"
        class="table text-center mt-4 mx-auto"
        style="width: 850px; overflow-x: auto"
        v-if="tablaLista"
      >
        <thead>
          <tr style="background-color: #2b4677; color: white; vertical-align: middle">
            <th scope="col">No. Cliente BAZ</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido Paterno</th>
            <th scope="col">Apellido Materno</th>
            <th scope="col">Tipo de Crédito</th>
            <th scope="col">Estatus de Cotizacion</th>
            <th scope="col">Modelo de Motocicleta</th>
            <th scope="col">Asesor BAZ</th>
            <th scope="col">Telefono:</th>
            <th scope="col">Correo electronico</th>
            <th scope="col">Pago inicial:</th>
            <th scope="col">Capacidad</th>
            <th scope="col">Fecha de Registro</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cotizacion, index23) in cotizacionesMostradas"
            :key="cotizacion.idCotizaciones"
          >
            <td>{{ cotizacion.NoClienteBAZ }}</td>
            <td>{{ cotizacion.Nombre }}</td>
            <td>{{ cotizacion.Apellido_Paterno }}</td>
            <td>{{ cotizacion.Apellido_Materno }}</td>
            <td>{{ cotizacion.DescripcionCredito }}</td>
            <td>{{ cotizacion.DescripcionEstatus }}</td>
            <td>
              <p v-for="moto in cotizacion.Motos">{{ moto[0].Modelo }}</p>
            </td>
            <td>{{ cotizacion.NombreAsesorBAZ }}</td>
            <td>{{ cotizacion.Telefono }}</td>
            <td>{{ cotizacion.Correo }}</td>
            <td>{{ cotizacion.PagoInicial }}</td>
            <td>{{ cotizacion.Capacidad }}</td>
            <td>{{ cotizacion.FechaRegistro }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!------------------------------------------------------- CITAS  --------------------------------------------------------->
    <div class="temp-target" ref="tagCitas">
      <div class="container mt-5 ms-0" style="text-align: center">
        <div class="row mb-5">
          <div class="col">
            <img src="src\assets\italikaReportes.png" class="img-fluid logoReportes" />
          </div>
          <div
            class="col"
            style="display: flex; justify-content: end; align-items: center"
          >
            <h5><strong>Fecha : </strong>{{ todayDate }}</h5>
          </div>
        </div>
        <div class="row">
          <h2 style="font-weight: bold">Distribuidora Italika Ramos Arizpe</h2>
        </div>
        <div class="row"><h3 style="font-weight: bold">Reporte de Citas</h3></div>
        <div class="row">
          <h5>
            Melchor Ocampo #305 Zona Centro Ramos Arizpe Coahuila, México. C.P 25900
          </h5>
        </div>
        <div class="row"><h5>Teléfono: 8441145047</h5></div>
        <div class="row">
          <h5>Elaborado por: {{ rolUsuario }} {{ nombreEmpleadoUsuario }}</h5>
        </div>
        <div class="row" style="text-align: end">
          <h5>Periodo: {{ fechaInicialFormatted }} - {{ fechaFinalFormatted }}</h5>
        </div>
      </div>
      <div class="table-responsive-xl">
        <table
          id="myTable"
          class="table table-hover text-center mt-4 mx-auto"
          style="width: 850px; overflow-x: auto"
          v-if="tablaLista"
        >
          <thead>
            <tr style="background-color: #2b4677; color: white; vertical-align: middle">
              <th scope="col">Cliente</th>
              <th v-if="superUsuario" scope="col" style="min-width: 150px">Empleado</th>
              <th scope="col" style="min-width: 150px">Fecha</th>
              <th scope="col">Hora</th>
              <th scope="col">Estatus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cita, index2) in citasDesplegadas" :key="cita.idCitas">
              <td>{{ cita.Clientes_idClientes }}</td>
              <td>{{ cita.Empleados_idEmpleados }}</td>
              <td v-if="superUsuario">
                {{ cita.fecha }}
              </td>
              <td>{{ cita.hora }}</td>
              <td>{{ cita.estatusCita }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!------------------------------------------------------- PROSPECTOS  --------------------------------------------------------->
    <div class="temp-target" ref="tagProspectos">
      <div class="container mt-5 ms-0" style="text-align: center">
        <div class="row mb-5">
          <div class="col">
            <img src="src\assets\italikaReportes.png" class="img-fluid logoReportes" />
          </div>
          <div
            class="col"
            style="display: flex; justify-content: end; align-items: center"
          >
            <h5><strong>Fecha : </strong>{{ todayDate }}</h5>
          </div>
        </div>
        <div class="row">
          <h2 style="font-weight: bold">Distribuidora Italika Ramos Arizpe</h2>
        </div>
        <div class="row"><h3 style="font-weight: bold">Reporte de Prospectos</h3></div>
        <div class="row">
          <h5>
            Melchor Ocampo #305 Zona Centro Ramos Arizpe Coahuila, México. C.P 25900
          </h5>
        </div>
        <div class="row"><h5>Teléfono: 8441145047</h5></div>
        <div class="row">
          <h5>Elaborado por: {{ rolUsuario }} {{ nombreEmpleadoUsuario }}</h5>
        </div>
        <div class="row" style="text-align: end">
          <h5>Periodo: {{ fechaInicialFormatted }} - {{ fechaFinalFormatted }}</h5>
        </div>
      </div>
      <div class="table-responsive-xl">
        <table
          id="myTable"
          class="table table-hover text-center mt-4 mx-auto"
          style="width: 850px; overflow-x: auto"
          v-if="tablaLista"
        >
          <thead>
            <tr style="background-color: #2b4677; color: white; vertical-align: middle">
              <th scope="col">No.Cliente BAZ</th>
              <th scope="col" style="min-width: 150px">Cliente</th>
              <th scope="col" style="min-width: 150px">Modelo Italika</th>
              <th scope="col">Medio de contacto</th>
              <th v-if="superUsuario" scope="col" style="min-width: 150px">Empleado</th>
              <th scope="col">Telefono</th>
              <th scope="col">Correo</th>
              <th scope="col" style="min-width: 150px">Fecha de registro</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(prospecto, index) in prospectosDesplegados"
              :key="prospecto.idProspectos"
            >
              <td v-if="!prospecto.noBAZ == ''">{{ prospecto.noBAZ }}</td>
              <td v-else><span class="badge bg-secondary"> N/D </span></td>
              <td>
                {{ prospecto.nombre }} {{ prospecto.paterno }} {{ prospecto.materno }}
              </td>
              <td>{{ prospecto.moto }}</td>
              <td>{{ prospecto.medio }}</td>
              <td v-if="superUsuario">
                {{ prospecto.usuario }}
              </td>
              <td>{{ prospecto.telefono }}</td>
              <td>{{ prospecto.correo }}</td>
              <td>{{ prospecto.Fecha_registro }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style>
.contPDF {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgb(131, 131, 131);
  border-radius: 1rem;
  text-align: center;
}

.framePDF {
  width: 100%;
  height: 100%;
}

.logoReportes {
  display: flex;
  width: 368px;
  height: 80px;
}
</style>

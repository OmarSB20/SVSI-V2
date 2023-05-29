<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import CompHeader from "../components/Header.vue";
import { cotizacionesStore } from "../stores/cotizaciones";

import { clientesStore } from "../stores/clientes";

import { asesoresStore } from "../stores/asesores";
import { creditosStore } from "../stores/creditos";
import { estatusCotizacionStore } from "../stores/estatusCotizacion";
import { rolesStore } from "../stores/roles";
import { usuariosStore } from "../stores/usuarios";
import { loginStore } from "../stores/login";
import router from "../router";
import { cotizacionMotoStore } from "../stores/cotizacionMoto";
import { catalogoStore } from "../stores/catalogo";

//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { setIdUsuario } = usuariosStore();
const { agregarUsuario } = usuariosStore();
const { obtenerRolesN } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();
const { obtenerIdPorUser } = usuariosStore();
const { obtenerCliente } = clientesStore();
const { obtenerUnUser } = usuariosStore();
const { traerCotizacionMotos } = cotizacionMotoStore();
const { getUser } = loginStore();
const { verificarPermisos } = loginStore();
const { obtenerEstatusCotizacionN } = estatusCotizacionStore();
const { obtenerAsesor } = asesoresStore();
const { obtenerUnModelo } = catalogoStore();

const { cotizacionExiste } = cotizacionesStore();
const { obtenerCotizaciones } = cotizacionesStore();
const { obtenerCotizacion } = cotizacionesStore();
const { agregarCotizacion } = cotizacionesStore();
const { setIdCotizacion } = cotizacionesStore();
const { eliminarCotizacion } = cotizacionesStore();
const { obtenerCreditosN } = creditosStore();
//variables reactivas
const cotizaciones = ref({});
//const roles = ref([]);
//const arrayNicknames = ref([]);
const deshabilitado = ref(true);
//para buscar
const cotizacionesFiltradas = ref({});
const nickActual = ref("");
const usuarioActual = ref("");
const nivelUsuario = ref("");
const cotizacionAct = ref("");
const idUsuarioAct = ref("");
const cotizacionFiltrados = ref([]);
const cotizacion = ref([]);
const busqueda = ref("");
const superUsuario = ref(false);
const idCotizacioneliminar = ref("");

const cotizacionArray = ref([]); //arreglo que guarda las cotizaciones que se mostraran en la tabla
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const arregloCotizacionesAux = ref([]);

const cotizacionesMostradas = ref([]);
//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  await consultarUsuarioAct();
  await consultarTodo();

  deshabilitado.value = true;
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

const consultarUsuarioAct = async () => {
  try {
    nickActual.value = getUser();
    usuarioActual.value = await obtenerIdPorUser({ Usuario: "Gerente" });
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

const consultarTodo = async () => {
  try {
    arregloCotizacionesAux.value =[];
    cotizacionArray.value = [];
    cotizacionesFiltradas.value = [];
    cotizacionesMostradas.value = [];
    let todas = await obtenerCotizaciones();
    todas = todas.data.body;
    console.log(todas);
    for (let item of todas) {
      let motos=[];
      var cotizacionesMotos = await traerCotizacionMotos();
      cotizacionesMotos.forEach(element => {
        if (element.Cotizaciones_idCotizaciones==item.idCotizaciones) {
          motos.push(element.Moto_idMoto)
        }
        
      });
      item.motos = motos;
      arregloCotizacionesAux.value.push(item);
    }
    console.log("ActualActualActualActualActualActualActualActualActualActual");

    console.log(arregloCotizacionesAux.value);

    arregloCotizacionesAux.value.forEach(async (element) => {
      console.log("Hola");
      var cotizacion = await obtenerCotizacion(element.idCotizaciones); //asigna cada elememento a cada cotizacion
      cotizacion = cotizacion.data.body[0];
      console.log(cotizacion);

      cotizacion.usuario = await obtenerUnUser(cotizacion.Empleados_idEmpleados);
      cotizacion.usuario = cotizacion.usuario.data.body[0].Usuario;

      if (!(superUsuario.value || cotizacion.usuario.trim() == nickActual.value.trim())) {
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
      cotizacion.FechaVisita = new Date(cotizacion.FechaVisita).toISOString().split('T')[0];
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
        Modelo: motos,
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
    });
    console.log(cotizacionArray.value);
    cotizacionesMostradas.value = cotizacionArray.value;
    console.log(
      "-------------------------------------------------------------------------"
    );
    console.log(cotizacionesMostradas.value);
  } catch (error) {
    console.log(error);
  }
};

function modificarCotizacion(idCotizaciones){
  setIdCotizacion(idCotizaciones);
  console.log(idCotizaciones);
  router.push({name:"actualizarCotizacion"})

}

function actualizarTabla() {
  let busquedaValor;
  if (busqueda.value.trim() == "") {
    cotizacionesMostradas.value = cotizacionArray.value;
  } else {
    busquedaValor = busqueda.value.replace(/ /g, "");
    cotizacionesMostradas.value = [];
    let nomAsesor;
    cotizacionArray.value.forEach((element) => {
      nomAsesor = element.Nombre + element.Apellido_Paterno + element.Apellido_Materno;

      if (nomAsesor.toLowerCase().includes(busquedaValor.toLowerCase())) {
        cotizacionesMostradas.value.push(element);
      }
    });
  }
}

async function eliminar(){
  await eliminarCotizacion(idCotizacioneliminar.value);
  await consultarTodo();

}

async function guardarIdEliminar(id){
  idCotizacioneliminar.value = id;
}
</script>
<template>
  <div class="container-fluid">
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
          <p class="italika" style="font-size: 50px">Cotizaciones</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika d-flex justify-content-start">Cotizaciones registradas</h5>
        </div>
      </div>
      <div class="col-3 align-items-end">
        <!-- <div class="row align-items-end pt-2">
          <input id="myInput" v-on:keyup="myFunction" type="text" class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e" placeholder="Buscar" />
        </div> -->

        <div class="row align-items-end pt-2">
          <input
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
            v-model.trim="busqueda"
            @input="actualizarTabla()"
          />
        </div>
        <div class="row">
          <div class="col-7">
            <h5 class="italika mt-3 d-flex justify-content-end">Agregar cotizaciones</h5>
          </div>

          <div class="col">
            <router-link to="../crearCotizacion" style="text-decoration: none">
              <button
                class="btn btn-primary btn-create mt-2 d-flex align-items-center justify-content-center"
                type="button"
                style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;
                "
              >
                <h4>+</h4>
              </button>
            </router-link>
          </div>
          <div class="col-3"></div>
        </div>
      </div>
    </div>
    <div style="height: auto; overflow: auto">
      <table id="myTable" class="table-striped text-center mt-4 mx-auto">
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
            <th scope="col">Fecha de Visita</th>
            <th scope="col">Hora inicial</th>
            <th scope="col">Hora final</th>
            <th scope="col">Fecha de venta</th>
            <th scope="col">Comentario</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <th scope="col" class="sticky" style="position: sticky; right: 0">
              Opciones
            </th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="cotizacion in cotizacionesMostradas">
            <td>{{ cotizacion.NoClienteBAZ }}</td>
            <td>{{ cotizacion.Nombre }}</td>
            <td>{{ cotizacion.Apellido_Paterno }}</td>
            <td>{{ cotizacion.Apellido_Materno }}</td>
            <td>{{ cotizacion.DescripcionCredito }}</td>
            <td>{{ cotizacion.DescripcionEstatus }}</td>
            <td>
              <div v-if="cotizacion.Modelo.length > 1" class="accordion-item">
                <h2 class="accordion-header" id="flush-headingThree">
                  <button
                    class="accordion-button collapsed normalAccordion"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    aria-expanded="false"
                    aria-controls="flush-collapseThree"
                  >
                    ver {{ cotizacion.Modelo.length }} motos
                  </button>
                </h2>
                <div
                  id="flush-collapseThree"
                  class="accordion-collapse collapse normalAccordion"
                  aria-labelledby="flush-headingThree"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="">
                    <button
                      v-for="moto in cotizacion.Modelo"
                      class="noAccordionBtn normalAccordion"
                    >
                      {{ moto[0].Modelo }}
                    </button>
                  </div>
                </div>
              </div>
              <p v-else><strong>{{ cotizacion.Modelo[0][0].Modelo }}</strong></p>
            </td>
            <td>{{ cotizacion.NombreAsesorBAZ }}</td>
            <td>{{ cotizacion.Telefono }}</td>
            <td>{{ cotizacion.Correo }}</td>
            <td>{{ cotizacion.PagoInicial }}</td>
            <td>{{ cotizacion.Capacidad }}</td>
            <td>{{ cotizacion.FechaRegistro }}</td>
            <td>{{ cotizacion.FechaVisita }}</td>
            <td>{{ cotizacion.HoraInicial }}</td>
            <td>{{ cotizacion.HoraFinal }}</td>
            <td>{{ cotizacion.FechaVenta }}</td>
            <td>{{ cotizacion.Comentario }}</td>

            <td scope="row" class="sticky" style="position: sticky">
              <div class="container">
                <div class="d-inline-flex">
                  <button
                    class="btn btn-primary d-inline-block mr-3 btn-spacer"
                    type="submit"
                    style="
                      background-color: #ffbe16;
                      border-color: #ffbe16;
                      height: 37px;
                      width: 45px;
                    "
                    @click="modificarCotizacion(cotizacion.idCotizaciones)"
                  >
                    <i class="fa-solid fa-pen-to-square" style="color: black"></i>
                  </button>
                  <button
                    class="btn btn-primary btn-delete d-inline-block"
                    type="submit"
                    data-bs-toggle="modal" data-bs-target="#modal"
                    style="
                      background-color: #c01a1a;
                      border-color: #c01a1a;
                      height: 37px;
                      width: 45px;
                      margin-top: 0% !important;
                    "
                    @click="guardarIdEliminar(cotizacion.idCotizaciones)"
                  >
                    <img
                      class="img-fluid mb-1"
                      style="width: 24.5px; height: 22.75px; margin-top: 0% !important"
                      src="../assets/basura.png"
                    />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal  modalCon-->
  <div
    class="modal fade"
    id="modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Cotización</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar esta cotización?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="eliminar()"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.normalAccordion {
  font-family: "Fjalla One";
  font-style: normal;
  letter-spacing: 0.04em;
  background-color: inherit !important;
  color: black !important;
  font-size: medium !important;
  max-height: inherit !important;
  border: none !important;
  margin-bottom: 10px;
  font-weight: inherit !important;
}

body {
  margin: 0;
  padding: 0;
  background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);
  min-height: 100vh;
}

.btn-spacer {
  margin-right: 10px;
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
::-webkit-scrollbar {
    display: none;
}
</style>
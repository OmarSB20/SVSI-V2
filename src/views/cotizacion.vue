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
const { obtenerRoles } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();
const { actualizarUsuario } = usuariosStore();
const { obtenerCliente } = clientesStore();
const { getIdUsuario } = usuariosStore();
const { traerCotizacionMotos } = cotizacionMotoStore();
const { reanudarSesion } = loginStore();
const { verificarPermisos } = loginStore();
const { obtenerEstatusCotizacionN } = estatusCotizacionStore();
const { obtenerAsesor } = asesoresStore();
const { obtenerUnModelo } = catalogoStore();



const { cotizacionExiste } = cotizacionesStore();
const { obtenerCotizaciones } = cotizacionesStore();
const { obtenerCotizacion } = cotizacionesStore();
const { agregarCotizacion } = cotizacionesStore();
const { actualizarCotizacion } = cotizacionesStore();
const { eliminarCotizacion } = cotizacionesStore();
const { obtenerCreditosN } = creditosStore();
//variables reactivas
const cotizaciones = ref({});
//const roles = ref([]);
//const arrayNicknames = ref([]);
const deshabilitado = ref(true);
//para buscar
const cotizacionesFiltradas = ref({});
const valorBusqueda = ref("");
const cotizacionAct = ref("");
const idUsuarioAct = ref("");
const cotizacionFiltrados = ref([]);
const cotizacion = ref([]);
const busqueda = ref("");

const cotizacionArray = ref([]);//arreglo que guarda las cotizaciones que se mostraran en la tabla 
//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const arregloCotizacionesAux = ref([]);
//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {

  // await montarCotizacion();
  // await consultarCotizaciones();
  await consultarTodo();

  deshabilitado.value = true;
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });

});
//consulta los roles usando el metodo de la store, los almacena en rolesArray
// const consultarRoles = async () => {
//   try {
//     roles.value = await obtenerRoles();
//     roles.value = roles.value.data.body;
//     console.log(roles.value);
//   } catch (error) {
//     console.log(error);
//   }
// };


const consultarTodo = async () => {
  try {
    var cotizaciones = (await traerCotizacionMotos());
    
    var cotizacionActual = null;
    
    await cotizaciones.forEach(async(element) => {
     
        cotizacionActual = await {
          Cotizaciones_idCotizaciones: element.Cotizaciones_idCotizaciones,
          motos: cotizaciones.filter(async (cotizacion)=>{
            return await cotizacion.Cotizaciones_idCotizaciones == element.Cotizaciones_idCotizaciones
          })
        }
        if (!arregloCotizacionesAux.value.some((cot) => cot.Cotizaciones_idCotizaciones === cotizacionActual.Cotizaciones_idCotizaciones)) {
          await arregloCotizacionesAux.value.push(cotizacionActual);
        }
      
    })
    
    console.log(arregloCotizacionesAux.value);  

    arregloCotizacionesAux.value.forEach(async (element) => {
      console.log("Hola");
      var cotizacion = await obtenerCotizacion(element.Cotizaciones_idCotizaciones);//asigna cada elememento a cada cotizacion
      cotizacion = cotizacion.data.body[0];
      console.log(cotizacion);

      var cliente = (await obtenerCliente(cotizacion.Clientes_idClientes));
      cliente = cliente.data.body[0];
      console.log(cliente);

      var tipoCredito = (await obtenerCreditosN(cotizacion.Tipos_De_Creditos_idTipos_De_Creditos));
      tipoCredito = tipoCredito.data.body[0];
      console.log(tipoCredito);

      var estatus = (await obtenerEstatusCotizacionN(cotizacion.EstatusCotizacion_idEstatusCotizacion));
      estatus = estatus.data.body[0];
      console.log(estatus);

      var asesor = (await obtenerAsesor(cotizacion.AsesoresBAZ_idAsesoresBAZ));
      asesor = asesor.data.body[0];
      console.log(asesor);

      var motos = [];
      for (const moto of element.motos) {
        var motoData = await obtenerUnModelo(moto.Moto_idMoto);
        motos.push(motoData.data.body);
      }
      console.log(motos);

      // console.log(moto);

      //para juntar todo
      const objetoCotizacion = await {
        "idCotizaciones": cotizacion.idCotizaciones,
        "NoClienteBAZ": cliente.NoClienteBAZ,
        "Nombre": cliente.Nombre,
        "Apellido_Paterno": cliente.Apellido_Paterno,
        "Apellido_Materno": cliente.Apellido_Materno,
        "DescripcionCredito": tipoCredito.Descripcion,
        "DescripcionEstatus": estatus.Descripcion,
        "Modelo":motos,
        "NombreAsesorBAZ": asesor.Nombre,
        "Telefono": cliente.Telefono,
        "Correo": cliente.Correo,
        "PagoInicial": cotizacion.PagoInicial,
        "Capacidad": cotizacion.Capacidad,
        "FechaRegistro": cotizacion.FechaRegistro,
        "FechaVisita": cotizacion.FechaVisita,
        "HoraInicial": cotizacion.HoraInicial,
        "HoraFinal": cotizacion.HoraFinal,
        "FechaVenta": cotizacion.FechaVenta,
        "Comentario": cotizacion.Comentario
      }
      console.log(objetoCotizacion);
      // console.log(objetoCotizacion);
      await cotizacionArray.value.push(objetoCotizacion); //agregar objeto al arreglo, lo hace una vez para cada objeto, a fin de cuentas termina haciendolo para todos los objetos
      console.log(cotizacionArray.value);

    });
    console.log(cotizacionArray.value);
    
  } catch (error) {

  }
};

// const buscarCotizaciones = (idCotizacion) => {
//   console.log(idCotizacion);

//   cotizacionArray.value.forEach(cotizacion => {
//     console.log(idCotizacion);
//     console.log(cotizacion.idCotizaciones);
//     if (cotizacion.idCotizaciones == idCotizacion) {
//       return true;
//     }
//   });
//   return false;

// }




const consultarCotizaciones = async () => {
  try {
    const cotizacionesArray = (await obtenerCotizaciones()).data.body;
    console.log(cotizacionesArray);
    cotizaciones.value = cotizacionesArray.reduce((acc, cur) => {
      acc[cur.cotizacion] = cur;
      return acc;
    }, {});
    cotizacionesFiltradas.value = cotizaciones.value;
  } catch (error) {
    console.log(error);
  }
};
// const buscarRol = (idRol) => {
//   const rolEncontrado = roles.value.find((rol) => rol.idRoles == idRol);
//   console.log(rolEncontrado.Nombre);
//   return rolEncontrado.Nombre;
// };
// const eliminarRoles = async (idRol) => {
//   try {
//     await eliminarPermisosDelRol(idRol);
//     await eliminarRol(idRol);
//     await consultarRoles();
//   } catch (error) {
//     console.log(error);
//   }
// };
function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}


const buscarCotizacion = () => {
  const busquedaValor = busqueda.value.toLowerCase();
  if (busquedaValor === "") {
    asesoresFiltrados.value = cotizacion.value;
  } else {
    asesoresFiltrados.value = cotizacion.value.filter((asesor) => {
      return (
        cotizacion.Nombre.toLowerCase().includes(busquedaValor) ||
        cotizacion.Apellido_Paterno.toLowerCase().includes(busquedaValor) ||
        cotizacion.Apellido_Materno.toLowerCase().includes(busquedaValor)
      );
    });
  }
};

function actualizarTabla() {
  let busquedaValor;
  if (busqueda.value.trim() == "") {
    cotizacionArray.value = cotizacion.value;
  } else {
    busquedaValor = busqueda.value.replace(/ /g, "");
    cotizacionArray.value = [];
    let nomAsesor;
    cotizacion.value.forEach((element) => {
      nomAsesor = element.Nombre + element.Apellido_Paterno + element.Apellido_Materno;

      if (nomAsesor.toLowerCase().includes(busquedaValor.toLowerCase())) {
        cotizacionArray.value.push(element);
      }
    });
  }
}




// const montarCotizacion = async () => {
//     cotizacionFiltrados.value=[];

//   cotizacion.value = await obtenerCotizacion();
//   cotizacion.value = cotizaacion.value.data.body;
//   console.log(cotizacion.value);

//   let cliente;
//   cotizacion.value.forEach(async (element) => {
//     console.log(element.Empleados_idEmpleados)
//     element.usuario = await obtenerUnUser(element.Empleados_idEmpleados)
//     element.usuario = element.usuario.data.body[0].Usuario;

//     element.moto = await obtenerUnModelo(element.Moto_idMoto);
//     element.moto = element.moto.data.body[0].Modelo;

//     element.medio = await obtenerMediosN(element.MedioDeContacto_idMedioDeContacto);
//     element.medio = element.medio.data.body[0].Descripcion;

//     cliente = await obtenerCliente(element.Clientes_idClientes);
//     cliente = cliente.data.body[0];

//     //en teoria estas lineas crean nuevas propiedades en el objeto
//     element.nombre = cliente.Nombre;
//     element.paterno = cliente.Apellido_Paterno;
//     element.materno = cliente.Apellido_Materno;
//     element.telefono = cliente.Telefono;
//     element.noBAZ = cliente.NoClienteBAZ;
//     element.correo = cliente.Correo;

//     //borramos la propiedad del idClientes que ya no necesitamos

//     delete element.idClientes;

//     if (superUsuario.value || element.usuario.trim() == nickActual.value.trim()) {
//         prospectosFiltrados.value.push(element)
//     }
//     prospectosDesplegados.value=prospectosFiltrados.value;
//   });

//   tablaLista.value = true;
// };






</script>
<template>
  <div class="container-fluid">
    <CompHeader />

    <div class="row">
      <div class="col-1 mb-3 pt-5 d-flex justify-content-end">
        <router-link to="/italika">
          <img class="img-fluid mt-3" style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png" />
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
            <router-link to="../crearUsuario" style="text-decoration: none">
              <button class="btn btn-primary btn-create mt-2 d-flex align-items-center justify-content-center"
                type="button" style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;
                ">
                <h4>+</h4>
              </button>
            </router-link>
          </div>
          <div class="col-3"></div>
        </div>
      </div>
    </div>
    <div class="table-responsive-sm">
      <table id="myTable" class="table table-hover table-striped text-center mt-4 mx-auto"
        style="width: 950px; overflow-x: scroll">
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
          <tr v-for="cotizacion in cotizacionArray">
            <td>{{ cotizacion.NoClienteBAZ }}</td>
            <td>{{ cotizacion.Nombre }}</td>
            <td>{{ cotizacion.Apellido_Paterno }}</td>
            <td>{{ cotizacion.Apellido_Materno }}</td>
            <td>{{ cotizacion.DescripcionCredito }}</td>
            <td>{{ cotizacion.DescripcionEstatus }}</td>
            <td>
                <p v-for="moto in cotizacion.Modelo">{{ moto[0].Modelo }} </p>
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
                  <button class="btn btn-primary d-inline-block mr-3 btn-spacer" type="submit" style="
                      background-color: #ffbe16;
                      border-color: #ffbe16;
                      height: 37px;
                      width: 45px;
                    " @click="modificarCotizacion(usuario.idEmpleados)">
                    <i class="fa-solid fa-pen-to-square" style="color: black;"></i>
                  </button>
                  <button class="btn btn-primary btn-delete d-inline-block" type="submit" style="
                      background-color: #c01a1a;
                      border-color: #c01a1a;
                      height: 37px;
                      width: 45px;
                      margin-top: 0% !important;
                    " @click="mostrarmodal(usuario.Usuario, usuario.idEmpleados)">
                    <img class="img-fluid mb-1" style="width: 24.5px; height: 22.75px; margin-top: 0% !important"
                      src="../assets/basura.png" />
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
  <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Usuario</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar al Usuario {{ cotizacionAct }}?</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
            @click="desactivarCotizacion(idUsuarioAct)">
            Confirmar
          </button>
        </div>
      </div>
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
</style>
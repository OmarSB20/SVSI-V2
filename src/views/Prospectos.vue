<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { usuariosStore } from "../stores/usuarios";
import { catalogoStore } from "../stores/catalogo";
import { clientesStore } from "../stores/clientes";
import { prospectosStore } from "../stores/prospectos";
import { loginStore } from "../stores/login";
import { rolesStore } from "../stores/roles";
import { mediosContactoStore } from "../stores/mediosContacto";
import CompHeader from "../components/Header.vue";
import router from "../router";
import cli from "nodemon/lib/cli";

const { obtenerRolesN } = rolesStore();
const { obtenerUnUser, obtenerIdPorUser } = usuariosStore();
const { consultarMotocicletas, obtenerUnModelo } = catalogoStore();
const { obtenerCliente, obtenerTodosClientes } = clientesStore();
const { obtenerProspectos, setIdProspecto, eliminarProspecto } = prospectosStore();
const { getUser } = loginStore();
const { obtenerMediosN, obtenerMedios } = mediosContactoStore();

//Variables reactivas
const fechaInicial = ref("");
const fechaFinal = ref("");
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
const nombre = ref("");
const idProspectoEl = ref();
const tablaLista = ref(false);

const buscarPor = ref("Nombre");
var modal;

onMounted(async () => {
  motos.value = await consultarMotocicletas();
  motos.value = motos.value.data.body;
  clientes.value = await obtenerTodosClientes();
  clientes.value = clientes.value.data.body;
  mediosContacto.value = await obtenerMedios();
  mediosContacto.value = mediosContacto.value.data.body;
  await consultarUsuarioAct();
  await montarProspectos();

  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

//Consultar el id de el empleado que accede a prospectos
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
  console.log(prospectos.value);

  let cliente;
  prospectos.value.forEach(async (element) => {
    console.log(element.Empleados_idEmpleados);
    element.usuario = await obtenerUnUser(element.Empleados_idEmpleados);
    element.usuario = element.usuario.data.body[0].Usuario;

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

    if (superUsuario.value || element.usuario.trim() == nickActual.value.trim()) {
      prospectosFiltrados.value.push(element);
    }
    prospectosDesplegados.value = prospectosFiltrados.value;
  });

  tablaLista.value = true;
};

const actualizarTabla = (nombre) => {
  if (nombre == "") {
    prospectosFiltrados.value = prospectosDesplegados.value;
  } else {
    nombre = nombre.replace(/ /g, "");
    prospectosFiltrados.value = [];
    prospectosDesplegados.value.forEach((element) => {
      console.log(element);
      const nomCliente = element.nombre + element.paterno + element.materno + "";
      console.log(nomCliente + " " + nombre);
      if (nomCliente.toLowerCase().includes(nombre.toLowerCase())) {
        prospectosFiltrados.value.push(element);
      }
    });
  }
};

function filtrarFecha() {
  console.log("viendoFecha");

  const ini = new Date(fechaInicial.value).getTime();
  const fin = new Date(fechaFinal.value).getTime();
  const resta = fin - ini;

  if (resta < 0||!ini||!fin) {
    //alertFecha.value = true;
    prospectosFiltrados.value = prospectosDesplegados.value;
  } else {
    prospectosFiltrados.value = [];
    prospectosDesplegados.value.forEach((element) => {
      let fechaObtenida = element.Fecha_registro;
      fechaObtenida = new Date(element.Fecha_registro).getTime();
      
      if (fechaObtenida >= ini && fechaObtenida <= fin) {
        prospectosFiltrados.value.push(element);
        console.log("ENTRO")
      }
    });
  }
}

function cambiarBusqueda() {
  if(buscarPor.value == "Nombre"){
    buscarPor.value = "Fecha";
  }else{
    buscarPor.value = "Nombre";
    prospectosFiltrados.value = prospectosDesplegados.value;

  }

}

const modificarProspecto = (idProspecto) => {
  setIdProspecto(idProspecto);
  router.push({ name: "actualizarProspecto" });
};

const eliminar = async () => {
  try {
    await eliminarProspecto(idProspectoEl.value);
    await montarProspectos();
  } catch (error) {
    console.log(error);
  }
};

const mostrarModal = (idProspecto) => {
  idProspectoEl.value = idProspecto;
  modal.show();
};
</script>

<template>
  <div class="container-fluid">
    <CompHeader />
    <div class="row">
      <div class="col-1 mb-3 pt-5">
        <router-link to="/italika">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col-5 mb-3 pt-5">
        <div class="row align-elements-end">
          <p class="italika" style="font-size: 50px">Prospectos</p>
        </div>
        <div class="row">
          <h5 class="italika d-flex justify-content-start">Prospectos registrados</h5>
        </div>
      </div>
      <div class="col-6 pt-4 d-flex align-elements-end">
        <div class="row d-flex align-elements-end pt-2">
          <button
            class="btn btn-primary rounded-pill mt-4"
            type="button"
            style="width: 100px; height: 50px"
            @click="cambiarBusqueda()"
          >
            {{ buscarPor }}
          </button>
          <input
            v-show="buscarPor == 'Nombre'"
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 300px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
            v-model.trim="nombre"
            @input="actualizarTabla(nombre)"
          />
          <input
            v-show="buscarPor == 'Fecha'"
            type="date"
            class="form-control rounded-pill mt-4"
            style="width: 150px; height: 50px; border-color: #5e5e5e"
            placeholder="Inicio"
            v-model.trim="fechaInicial"
            @input="filtrarFecha()"
          />
          <input
            v-show="buscarPor == 'Fecha'"
            type="date"
            class="form-control rounded-pill mt-4"
            style="width: 150px; height: 50px; border-color: #5e5e5e"
            placeholder="Fin"
            v-model.trim="fechaFinal"
            @input="filtrarFecha()"
          />
        </div>
        <div class="row pt-3">
          <div class="col-1"></div>
          <div class="col-6 d-flex align-elements-center justify-content-end">
            <h5 class="italika mt-3 d-flex justify-content-end">Agregar Prospecto</h5>
          </div>

          <div class="col d-flex align-elements-start">
            <router-link to="../crearProspecto" style="text-decoration: none">
              <button
                class="btn btn-primary mt-2 d-flex align-elements-center justify-content-center"
                type="button"
                style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;
                "
                @input="agregarProspecto()"
              >
                <h4>+</h4>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive-xl">
      <table
        id="myTable"
        class="table table-hover table-striped text-center mt-4 mx-auto"
        style="width: 850px; overflow-x: auto"
        v-if="tablaLista"
      >
        <thead>
          <tr style="background-color: #2b4677; color: white; vertical-align: middle">
            <th scope="col-3">No.Cliente BAZ</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido Paterno</th>
            <th scope="col">Apellido Materno</th>
            <th scope="col">Modelo Italika</th>
            <th scope="col">Medio de contacto</th>
            <th v-if="superUsuario" scope="col">Usuario</th>
            <th scope="col">Telefono</th>
            <th scope="col">Correo</th>
            <th scope="col">Comentario</th>
            <th scope="col" style="min-width: 150px">Fecha de registro</th>
            <th scope="col" class="sticky" style="position: sticky; right: 0">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prospecto in prospectosFiltrados" :key="prospecto.idProspectos">
            <td v-if="!prospecto.noBAZ == ''">{{ prospecto.noBAZ }}</td>
            <td v-else><span class="badge bg-secondary"> N/D </span></td>
            <td>{{ prospecto.nombre }}</td>
            <td>{{ prospecto.paterno }}</td>
            <td>{{ prospecto.materno }}</td>
            <td>{{ prospecto.moto }}</td>
            <td>{{ prospecto.medio }}</td>
            <td v-if="superUsuario">
              {{ prospecto.usuario }}
            </td>
            <td>{{ prospecto.telefono }}</td>
            <td>{{ prospecto.correo }}</td>
            <td v-if="!prospecto.Comentario.trim() == ''">{{ prospecto.Comentario }}</td>
            <td v-else><span class="badge bg-secondary"> N/D </span></td>
            <td>{{ prospecto.Fecha_registro }}</td>
            <td scope="row" class="sticky" style="position: sticky">
              <div class="container">
                <div class="d-inline-flex">
                  <button
                    class="btn btn-primary d-flex align-items-center justify-content-center btn-spacer"
                    type="submit"
                    style="
                      background-color: #ffbe16;
                      border-color: #ffbe16;
                      height: 37px;
                      width: 45px;
                    "
                    @click="modificarProspecto(prospecto.idProspectos)"
                  >
                    <i
                      class="fa-solid fa-pen-to-square"
                      style="color: black; width: 28.5px; height: 18.75px"
                    ></i>
                  </button>
                  <button
                    class="btn btn-primary btn-delete d-inline-block"
                    type="submit"
                    style="
                      background-color: #c01a1a;
                      border-color: #c01a1a;
                      height: 37px;
                      width: 45px;
                      margin-top: 0% !important;
                    "
                    @click="mostrarModal(prospecto.idProspectos)"
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
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Prospecto</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar este prospecto?</span>
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

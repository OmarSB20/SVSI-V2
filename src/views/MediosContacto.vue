<script setup>
import { ref, computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { usuariosStore } from "../stores/usuarios";
import { rolesStore } from "../stores/roles";
import CompHeader from "../components/Header.vue";
import router from "../router";
import { mediosContactoStore } from "../stores/mediosContacto"


//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { setIdUsuario } = usuariosStore();
const { agregarUsuario } = usuariosStore();
const { obtenerRoles } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();
const { actualizarUsuario } = usuariosStore();
const { getIdUsuario } = usuariosStore();
const { obtenerMedios, eliminarMedioContacto, actualizarMedioContacto, agregarMediosContacto, obtenerNombresMedios } = mediosContactoStore();

//variables reactivas
const mediosArray = ref([]);
const mediosDesplegados = ref({});
const roles = ref([]);
const arrayNicknames = ref([]);
const deshabilitado = ref(true);
//para buscar
const usuariosFiltrados = ref({});
const valorBusqueda = ref("");
const nombreUsuarioAct = ref("");
const medioContactoNuevo = ref("");
const idUsuarioAct = ref("");
const botonActualizar = ref(false);
const idMedioEl = ref("");
const nombreMedioEl = ref("");
const idBotonActualizar = ref(0);
const medioAgregado = ref("");
const nombreAntiguo = ref("");
const nombreActualizado = ref("");
const mediosActivoArray = ref("");
const nombre = ref("");

//variable asociada al modal
var modal1;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const repetido = ref(false);


var nombreActual;

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(async () => {
  await consultarMediosContacto();
  const res = await obtenerNombresMedios();
  mediosActivoArray.value = res.data.body;
  console.log(res.data.body);

  // await consultarUsuarios();
  deshabilitado.value = true;
  modal1 = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});




//esta funcion es para q me salga en la tabla 

const consultarMediosContacto = async () => {
  try {

    const medioContacto = await obtenerMedios();
    console.log(medioContacto.data.body);
    mediosArray.value = medioContacto.data.body; //guardo tofo
    mediosDesplegados.value = medioContacto.data.body; //filtrado
  } catch (error) {
    console.log(error);
  }
};



function modificarNombreMediosDeContacto(Descripcion, idMedioDeContacto) {
  medioContactoNuevo.value = Descripcion;

  idBotonActualizar.value = idMedioDeContacto;
  if (!botonActualizar.value) {
    nombreActual = Descripcion;
    console.log(nombreActual)
    botonActualizar.value = true;
  } else {
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    medioContactoNuevo.value = "";
    nombreActual = "";
    console.log(nombreActual)
  }
  repetido.value = false;
}



function mostrarModalEliminar(idMedioDeContacto, Descripcion) {
  idMedioEl.value = idMedioDeContacto;
  nombreMedioEl.value = Descripcion;
  modal1 = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
  modal1.show();
}

async function eliminarmedio() {
  try {
    await actualizarMedioContacto(idMedioEl.value, nombreMedioEl.value, 2);
    await consultarMediosContacto();
    medioContactoNuevo.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
  } catch (error) {
    console.log(error);
  }
}


// async function eliminarCredito() {
//   try {
//     await actualizarCredito(idCredEl.value, nombreCreditEl.value,2);
//     await consultarCredito();
//     creditoNuevo.value = "";
//     botonActualizar.value = false;
//     idBotonActualizar.value = -1;
//   } catch (error) {
//     console.log(error);
//   }
// }

const revisarMedioExistente = () => {
  console.log(medioContactoNuevo.value);
  if (medioContactoNuevo.value.trim() == "" || medioContactoNuevo.value.trim() == nombreActual) {
    deshabilitado.value = true;
    repetido.value = false;
    return;
  }
  try {
    for (var j in mediosActivoArray.value) {
      if (
        mediosActivoArray.value[j].Descripcion.toLowerCase() ==
        medioContactoNuevo.value.trim().toLowerCase()
      ) {
        repetido.value = true;
        deshabilitado.value = true;
        console.log(medioContactoNuevo.value)

        return true;
      } else {
        repetido.value = false;
        deshabilitado.value = false;
      }
    }
    console.log(repetido.value)
    repetido.value = false;
    deshabilitado.value = false;
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


async function guardarMedio(Descripcion) {
  try {
    console.log(Descripcion);
    await agregarMediosContacto(Descripcion);
    await consultarMediosContacto();
    const res = await obtenerNombresMedios();
    mediosActivoArray.value = res.data.body;
    modal1 = new bootstrap.Modal(document.getElementById("modal1"), {
      keyboard: false,
    });
    modal1.show();
    medioAgregado.value = medioContactoNuevo.value;
    console.log(medioAgregado.value)
    medioContactoNuevo.value = "";
  } catch (error) {
    console.log(error);
  }
}


async function modificarMedio(idMedioDeContacto, Descripcion) {
  try {
    nombreAntiguo.value = nombreActual;
    nombreActualizado.value = Descripcion;
    console.log(Descripcion + "Es el que recibira")
    console.log(nombreActual + "es el original")
    await actualizarMedioContacto(idMedioDeContacto, Descripcion, 1);
    await consultarMediosContacto();
    const res = await obtenerNombresMedios();
    mediosActivoArray.value = res.data.body;
    medioContactoNuevo.value = "";
    botonActualizar.value = false;
    idBotonActualizar.value = -1;
    modal1 = new bootstrap.Modal(document.getElementById("modalAct"), {
      keyboard: false,
    });
    modal1.show();
    nombreActual = "";

  } catch (error) {
    console.log(error);
  }
}


function actualizarTabla() {
  console.log(nombre.value);
  if (nombre.value.trim() == "") {
    //recorta los espacios
    mediosDesplegados.value = mediosArray.value;
  } else {
    mediosDesplegados.value = []; //inicializa vacio deja limpio
    mediosArray.value.forEach((element) => {
      //recorre el elemento
      if (element.Descripcion.trim().toLowerCase().includes(nombre.value.trim().toLowerCase())) {
        //checa si  coincide
        mediosDesplegados.value.push(element); //aqui lo va a grefgar a creditosDesplegaados
      }
    });
  }
}

</script>
<template>
  <div class="container-fluid">
    <CompHeader />

    <div class="row">
      <div class="col-1 mb-3 pt-5">
        <router-link to="/italika">
          <img class="img-fluid mt-3" style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png" />
        </router-link>
      </div>
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Medios de contacto</p>
        </div>
      </div>
      <div class="col-3 align-items-end">
        <div class="row align-items-end pt-2">
          <input type="text" class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e" placeholder="Buscar" v-model="nombre"
            @input="actualizarTabla(nombre)" />
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-2 mt-2 ms-5">
        <h5 class="italika d-flex justify-content-end">Nombre del medio:</h5>
      </div>
      <div class="col-6">
        <input type="text" class="form-control" @input="revisarMedioExistente()" v-model.trim="medioContactoNuevo" />
        <div v-if="repetido" class="alert alert-danger mt-2 d-flex align-items-center" style="height: 38px" role="alert">
          "{{ medioContactoNuevo }}" ya existe
        </div>

      </div>


      <div class="col">
        <button v-if="!botonActualizar" class="btn btn-primary" type="submit" :disabled="deshabilitado"
          @click="guardarMedio(medioContactoNuevo)">
          Guardar
        </button>

        <button v-if="botonActualizar" class="btn btn-success" type="submit" :disabled="deshabilitado"
          @click="modificarMedio(idBotonActualizar, medioContactoNuevo)">
          Actualizar
        </button>

      </div>
    </div>
    <div class="table-responsive-sm">
      <table id="myTable" class="table table-hover table-striped text-center mt-4 mx-auto"
        style="width: 950px; overflow-x: scroll">
        <thead>
          <tr style="background-color: #2b4677; color: white; vertical-align: middle">
            <th scope="col">Nombre</th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <th scope="col" class="sticky" style="position: sticky; right: 0; width:200px">
              Opciones
            </th>
            <!-- <th scope="col" style="width: 200px"></th> -->
            <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="mediosContacto in mediosDesplegados">
            <td>{{ mediosContacto.Descripcion }}</td>

            <!-- <td>{{ usuario.Roles_idRoles }}</td>  -->

            <td scope="row" class="sticky" style="position: sticky">
              <div class="container">
                <div class="d-inline-flex">
                  <button :id="mediosContacto.idMedioDeContacto" :class="[
                    botonActualizar && idBotonActualizar == mediosContacto.idMedioDeContacto
                      ? 'btn btn-primary mx-1'
                      : 'btn btn-warning mx-1',
                  ]" type="submit" style="border-color: #ffbe16; height: 37px" @click="
  modificarNombreMediosDeContacto(mediosContacto.Descripcion, mediosContacto.idMedioDeContacto)
  ">
                    <i :class="[
                      botonActualizar && idBotonActualizar == mediosContacto.idMedioDeContacto
                        ? 'fa-solid fa-clock-rotate-left'
                        : 'fa-solid fa-pen-to-square',
                    ]"></i>

                    <!-- <img class="img-fluid mb-3" style="width: 24.5px; height: 25.75px; margin-top: 0% !important"
                :src="[botonActualizar && idBotonActualizar == credito.idTipos_De_Creditos ? 'https://cdn-icons-png.flaticon.com/512/3585/3585896.png' : 'SVSI-V2/src/assets/lapiz.png' ]"   /> -->
                  </button>
                  <button class="btn btn-primary mx-1" type="submit"
                    style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                    @click="mostrarModalEliminar(mediosContacto.idMedioDeContacto, mediosContacto.Descripcion)">
                    <img class="img-fluid mb-1" style="width: 24.5px; height: 22.75px" src="../assets/basura.png" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- <td scope="row">
            <div class ="container">
              
              <div class ="row">
                
                <div class ="col">
                  <button
                class="btn btn-primary   d-inline-block" 
                type="submit"
                style="background-color: #ffbe16; border-color: #ffbe16; height: 37px"
                @click="modificaruser (usuario.idEmpleados)"
              >
                <img
                  class="img-fluid mb-3"
                  style="width: 100; height: 20px; margin-top: 0% !important"
                  src="../assets/lapiz.png"
                />
              </button>
                </div>
                <div class ="col">
                  <button
                class="btn btn-primary d-inline-block"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px; margin-top: 0% !important"
                @click="mostrarmodal(usuario.Usuario, usuario.idEmpleados)"
              >
                <img
                class="img-fluid mb-1"
                  style="width: 24.5px; height: 22.75px ; margin-top: 0% !important"
                  src="../assets/basura.png"
                
                />
              </button>
                </div>
            </div>
         </div>
        
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div> -->

  <!-- Modal  modalCon-->

  <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Elminar Medio de Contacto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar el Medio de Contacto"{{ nombreMedioEl }}"?</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="eliminarmedio()">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modalAct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Medios de Contacto</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modalAct" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>¡Medio de Contacto "{{ nombreAntiguo }}" actualizado a "{{ nombreActualizado }}" con exito!</h5>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>


  </div>

  <div class="modal fade" id="modal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Medios de Contacto</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal1" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h5>¡Medio de Contacto "{{ medioAgregado }}" guardado exitosamente!</h5>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cerrar
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
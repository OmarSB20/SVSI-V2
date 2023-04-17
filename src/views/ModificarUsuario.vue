<script setup>
import { ref,computed } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
import { usuariosStore } from "../stores/usuarios";
import { rolesStore } from "../stores/roles";
import CompHeader from "../components/Header.vue";
import router from "../router";


//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const {setIdUsuario} = usuariosStore();
const { agregarUsuario } = usuariosStore();
const { obtenerRoles } = rolesStore();
const { obtenerUsuarios } = usuariosStore();
const { eliminarUsuario } = usuariosStore();
const {actualizarUsuario} = usuariosStore();
const {getIdUsuario} =usuariosStore();

//variables reactivas
const usuarios = ref({});
const roles = ref([]);
const arrayNicknames = ref([]);
const deshabilitado = ref(true);
//para buscar
const usuariosFiltrados = ref({});
const valorBusqueda = ref("");
const nombreUsuarioAct =ref("");
const idUsuarioAct =ref("");

//variable asociada al modal
var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(() => {
  consultarRoles();
  consultarUsuarios();
  obtenerRoles();
  deshabilitado.value = true;
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

//consulta los roles usando el metodo de la store, los almacena en rolesArray
const consultarRoles = async () => {
  try {
    roles.value = await obtenerRoles();
    roles.value = roles.value.data.body;
    console.log(roles.value);
  } catch (error) {
    console.log(error);
  }
};

const consultarUsuarios = async () => {
  try {
    const usuariosArray = (await obtenerUsuarios()).data.body;
    console.log(usuariosArray);
    usuarios.value = usuariosArray.reduce((acc, cur) => {
      acc[cur.Usuario] = cur;
      return acc;
    }, {});
    usuariosFiltrados.value = usuarios.value;
  } catch (error) {
    console.log(error);
  }
};

const buscarRol = (idRol)=>{
const rolEncontrado = roles.value.find((rol) => rol.idRoles == idRol)
console.log(rolEncontrado.Nombre);
return rolEncontrado.Nombre
}


const eliminarRoles = async (idRol) => {
  try {
    await eliminarPermisosDelRol(idRol);
    await eliminarRol(idRol);
    await consultarRoles();
  } catch (error) {
    console.log(error);
  }
};

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

function modificaruser (idEmpleados){
  setIdUsuario(idEmpleados) //guardar el ide en el store
  //mandar a otra interfaz
   router.push ({name:"login"})


}

function confirmar(idEmpleados) {
  idempleadoEliminar.value = idEmpleados;
  modalConfirmacion.show();
}

function mostrarmodal(unombreUsuario, idUsuario){
  nombreUsuarioAct.value =unombreUsuario
  idUsuarioAct.value =idUsuario

    modal.show()
 console.log(idUsuarioAct.value)
 console.log(nombreUsuarioAct.value)

}

onMounted(async () => {
  consultarUsuarios();
});


function desactivarUsuario(idEmpleado){
  console.log(idEmpleado)
  //decalro un objeto lo que se recibe la funcion con el inactivo 
const usuarioActualizar = {idEmpleados: idEmpleado, 
  EstatusActividad_idEstatusActividad: 2}

  //mando llamar el metodo
  try {
    actualizarUsuario(usuarioActualizar)
    
  } catch (error) {
    console.log(error)
    
  }
  consultarUsuarios()


}


</script>
<template>
  <div class="container-fluid">
    <div class="row" style="background-color: black" height="100px">
      <div class="col-10">
        <img
          class="img-fluid mt-1"
          style="width: 335px; height: 80px"
          src="../assets/LogoItalikaRamos.png"
        />
      </div>
      <div class="col">
        <p style="font-size: 60px" class="italika d-flex justify-content-start mb-0">
          SVSI
        </p>
      </div>
    </div>
    <div class="row ">
      <div class="col-1 mb-3 pt-5">
        <router-link to=" http://localhost:5173">
        
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </router-link>
      </div>
      <div class="col-8 mb-3 pt-5">
        <div class="row align-items-end">
          <p class="italika" style="font-size: 50px">Usuarios</p>
        </div>
        <div class="row align-items-end">
          <h5 class="italika d-flex justify-content-start">Usuarios registrados</h5>
        </div>
      </div>
      <div class="col-3 align-items-end ">
        <div class="row align-items-end pt-2">
          <input id="myInput" v-on:keyup="myFunction"
            type="text"
            class="form-control rounded-pill mt-4"
            style="width: 250px; height: 50px; border-color: #5e5e5e"
            placeholder="Buscar"
          />
        </div>
        <div class="row">
          <div class="col-6">
            <h5 class="italika mt-3">Agregar Usuarios</h5>
          </div>

          <div class="col-1">
            <router-link to="../crearUsuario">
              <button
                class="btn btn-primary mt-2 d-flex align-items-center"
                type="button"

                style="background-color: #66d054;width: 40px;height: 40px;border-color: #5e5e5e; ">
                <h4>+</h4>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive table-container" >
      
    <table id="myTable"
      class="table table-hover table-striped table-container text-center mt-4 mx-auto"
      style="width: 950px ; overflow-x: scroll;"

    >
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Nombre Usuario</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
          <th scope="col">Nombre</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
          <th scope="col">Apellido paterno</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
          <th scope="col">Apellido materno</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
          <th scope="col">Correo</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
          <th scope="col">Telefono</th>
          <th scope="col">Rol</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
          <th scope="col" class="sticky" style="position: sticky;  right: 0; width: 80px;">Opciones</th>
          <!-- <th scope="col" style="width: 200px"></th> -->
        <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.idEmpleados">
        <td>{{ usuario.Usuario }}</td>
        <td>{{ usuario.Nombre }}</td>
        <td>{{ usuario.Apellido_Paterno }}</td>
        <td>{{ usuario.Apellido_Materno }}</td>
        <td>{{ usuario.Correo }}</td>
        <td>{{ usuario.Telefono }}</td>
        <!-- <td>{{ usuario.Roles_idRoles }}</td>  -->
      <td>{{buscarRol(usuario.Roles_idRoles) }}</td>
      <td scope="row"  class="sticky" style="position: sticky;">
  <div class="container">
    <div class="d-inline-flex">
      <button
        class="btn btn-primary d-inline-block mr-3 btn-spacer" 
        type="submit"
        style="background-color: #ffbe16; border-color: #ffbe16; height: 37px; width: 45px;"
        @click="modificaruser(usuario.idEmpleados)"
      >
        <img
          class="img-fluid mb-3"
          style="width: 100; height: 20px; margin-top: 0% !important"
          src="../assets/lapiz.png"
        />
      </button>
      <button
        class="btn btn-primary d-inline-block"
        type="submit"
        style="background-color: #c01a1a; border-color: #c01a1a; height: 37px; width: 45px;margin-top: 0% !important"
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
          <h5 class="modal-title" id="exampleModalLabel">Eliminar Usuario</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar al Usuario {{nombreUsuarioAct}}?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="desactivarUsuario(idUsuarioAct)"
          >
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

.table-striped tbody tr .sticky{
  background-color:  white;
}
.table-striped tbody tr:nth-child(2n) .sticky{
  background-color: inherit ;
}

.table-striped tbody th .sticky{
  background-color: #2b4677; color: white
}

#myTable th {
  background-color: #2b4677; color: white
}

#myTable .sticky  {
  border-collapse: collapse;
  position:sticky;
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

.table-container{
  max-width: 100%;
  overflow-x: scroll;
}
</style>
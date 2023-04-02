<script setup>
import { ref } from "vue"; //para usar variables reactivas
import { onMounted } from "vue"; //para poder usar el onMounted, que ejecuta todo lo que tenga adentro cada que cargue la pagina
/*
import { permisosStore } from "../stores/permisos"; //para poder usar store de permisos
import { rolesStore } from "../stores/roles"; //para poder usar store de roles
import { permisosRolesStore } from "../stores/permisosRoles"; //para poder usar store de permisosRoles


//declaramos como constantes los metodos exactos que vamos a usar de las stores y lo igualamos a la store de donde vienen
//           metodo    =     store de la que viene
const { obtenerPermisos } = permisosStore();
const { agregarRol } = rolesStore();
const { obtenerRoles } = rolesStore();
const { agregarPermisosDelRol } = permisosRolesStore();
*/
//variables reactivas
const permisos = ref([]); //guardara el objeto obtenido de obtener permisos
const permisosArray = ref([]); //guardara cada uno de los permisos (idPermisos y Descripcion)
const permisosAgregados = ref([]); //guardara los idPermisos de los permisos que hayan sido seleccionados
const checksDir = ref({}); //cada una de sus posiciones se asociará al estado de un check, cambiar el valor de cierta posicion afectara a su checkbox y lo seleccionara o deseleccionara según sea true o false
const rolNuevo = ref(""); //se asociara al valor del textbox del rol, cambiar su valor, cambia lo que hay en el textbox y visceversa
const rolesArray = ref([]); //guardara cada uno de los roles (idRoles y Nombre)
const repetido = ref(false); //es true sí el rol que se quiere crear ya existe
const deshabilitado = ref(false);
const checksVacios = ref(false); //es true si no se ha seleccionado ningun checkbox
//variable asociada al modal
var modal;

//al cargar la pagina se consultan los permisos y roles que hay en la BD y se define el objeto relacionado al modal
onMounted(() => {
  consultarPermisos();
  consultarRoles();
  if (rolNuevo.value.trim() == "") {
    deshabilitado.value = true;
  }
  modal = new bootstrap.Modal(document.getElementById("modal"), {
    keyboard: false,
  });
});

/*
//función que vacía el textbox, el arreglo de permisos arreglados y deselecciona los checkbox
//se activará cuando se de click en "seguir creando roles" en el modal
function resetCampos(){
  rolNuevo.value = "";
  permisosAgregados.value = [];
  for(var j in checksDir.value){
    checksDir.value[j] = false;
  }
}


//consulta los roles usando el metodo de la store, los almacena en rolesArray
const consultarRoles = async () => {
  try {
    rolesArray.value = await obtenerRoles(); //recibimos el objeto que retorna la peticion, este contiene toda la info
    rolesArray.value = rolesArray.value.data.body; //reescrbimos la variable ahora solo con el body del objeto, en el body están los datos de los roles 
  } catch (error) {
    console.log(error);
  }
};


//consulta los permisos - misma logica que consuktar roles
const consultarPermisos = async () => {
  try {
    permisos.value = await obtenerPermisos();
    const body = permisos.value.data.body;
    for (var j in body) { //por cada elemento (permiso) en el body, vamos a meter el elemento al arreglo de permisos y guardar un false en el checksDir
      permisosArray.value.push(body[j]);
      checksDir.value[body[j].idPermisos] = false;
    }
  } catch (error) {
    console.log(error);
  }
};


//revisa si el rol a crear ya existe, el reusltado se guarda en "repetido"
const revisarRolExistente = async () => {
  if (rolNuevo.value.trim()=="") {
    deshabilitado.value = true;
    return;
  }
  try {
    for (var j in rolesArray.value) {
      if (
        rolesArray.value[j].Nombre.toLowerCase() == rolNuevo.value.trim().toLowerCase()
      ) {
        repetido.value = true;
        deshabilitado.value = true;
        return true;
      }
    }
    repetido.value = false;
    deshabilitado.value = false;
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//metodo que crea el nuevo rol
const crearRol = async (nombreRol) => {
  try {
    if(permisosAgregados.value.length == 0){ //si no hay permisos seleccionados, lo indicamos cambiando el valor de checksVacios y salimos de la funcion sin crear nada
      checksVacios.value = true;
      return;
    }
    var idRolCreado = 0; //aquí se va a guardar el idRoles del rol que se acaba de insertar
    await agregarRol(nombreRol.trim()); //creamos el rol
    await consultarRoles(); //consultamos los roles, ya que ahora hay uno nuevo con id desonocido por nosotros

    for (var j in rolesArray.value) {//buscamos el rol en el arreglo que coincide con el que acabamos de crear
      if (
        rolesArray.value[j].Nombre.toLowerCase() == rolNuevo.value.trim().toLowerCase()
      ) {
        idRolCreado = rolesArray.value[j].idRoles; //guardamos su id
        break; //salimos del for
      }
    }
    for (var j in permisosAgregados.value) { //por cada permiso seleccionado vamos a insertarlo a la tabla permisosRoles, aquí usamos el idRolCreado que conseguimos
      await agregarPermisosDelRol(idRolCreado, permisosAgregados.value[j]);
    }
    modal.show(); //al ser todo exitoso, mostramos el modal notificando el exito

  } catch (error) {
    console.log(error);
  }
};

//metodo que segun el estado de un checkbox, agrega o saca al permiso que le corresponde del arreglo de permisosAgregados 
function moverPermiso(id) {
  if (checksDir.value[id]) {
    permisosAgregados.value = permisosAgregados.value.filter((item) => item !== id);
  } else {
    permisosAgregados.value.push(id);
    checksVacios.value=false;
  }
}

function verRoles(){
  window.location.href = "http://localhost:5173/modificarRol";
}
*/
</script>

<template>
  <form @submit.prevent="crearRol(rolNuevo)">
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
      <!-----------------------    Row de titulo  --------------------------->
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
            Crear Usuario
          </p>
        </div>
      </div>

      <!-----------------------    Row 1 Formulario   --------------------------->
      <div class="row mb-4 pb-2">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Nombre:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>

      <!-----------------------    Row 2 Formulario  --------------------------->

      <div class="row mb-4 pb-2">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Apellido paterno:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>
      <!-----------------------    Row 3 Formulario  --------------------------->

      <div class="row mb-4 pb-2">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Correo electronico:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>
      <!-----------------------    Row 4 Formulario  --------------------------->

      <div class="row mb-4 pb-2" style="background-color: black">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Teléfono:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>
      <!-----------------------    Row 5 Formulario  --------------------------->

      <div class="row mb-4 pb-2">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Nombre de usuario:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>
      <!-----------------------    Row 6 Formulario  --------------------------->

      <div class="row mb-4 pb-2">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Contraseña:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>
      <!-----------------------    Row 7 Formulario  --------------------------->

      <div class="row">
        <div class="col-2 mt-2 ms-5">
          <h5 class="italika d-flex justify-content-end">Confirmar contraseña:</h5>
        </div>
        <div class="col">
          <input
            type="text"
            class="form-control"
            @input="revisarRolExistente()"
            v-model="rolNuevo"
          />
        </div>
      </div>

<!-----------------------    Row 8 Formulario  --------------------------->

<div class="row">

</div>

    </div>
  </form>

  <!-- Modal -->
  <div
    class="modal fade"
    id="modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">¡Rol creado!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">El rol {{ rolNuevo }} fue creado exitosamente.</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="resetCampos()"
            data-bs-dismiss="modal"
          >
            Seguir creando roles
          </button>
          <button type="button" class="btn btn-success" @click="verRoles()">
            Ver roles
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

.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
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

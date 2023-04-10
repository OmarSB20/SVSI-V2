<script setup>
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
        <a href="http://localhost:5173">
          <img
            class="img-fluid mt-3"
            style="margin-top: 20px; width: 31.23px; height: 35.5px"
            src="../assets/triangulito.png"
          />
        </a>
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
          <input
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
            <!--<router-link to="../crearRol">-->
              <button
                class="btn btn-primary mt-2 d-flex align-items-center"
                type="submit"
                style="
                  background-color: #66d054;
                  width: 40px;
                  height: 40px;
                  border-color: #5e5e5e;
                "
              >
                <h4>+</h4>
              </button>
            <!--</router-link>-->
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive">
    <table
      class="table table-hover table-striped text-center mt-4 mx-auto"
      style="width: 900px"
    >
      <thead>
        <tr style="background-color: #2b4677; color: white">
          <th scope="col">Nombre Usuario</th>
          <th scope="col" style="width: 200px"></th>
          <th scope="col">Nombre</th>
          <th scope="col" style="width: 200px"></th>
          <th scope="col">Apellido paterno</th>
          <th scope="col" style="width: 200px"></th>
          <th scope="col">Apellido materno</th>
          <th scope="col" style="width: 200px"></th>
          <th scope="col">Correo</th>
          <th scope="col" style="width: 200px"></th>
          <th scope="col">Telefono</th>
          <th scope="col" style="width: 200px"></th>
          <th scope="col" style="position: sticky; right: 0">Opciones</th>
          <th scope="col" style="width: 200px"></th>
        <!-- Establecemos "position:sticky" en la columna de "Opciones" -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="rol in rolesDesplegados">
          <td>
         <!--   {{ rol.Nombre }}-->
          </td>
          <th scope="row">
            <div class="align-items-center">
              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #59c01a; border-color: #59c01a; height: 37px"
                @click="consultarPermisosDeRol(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 28.5px; height: 18.75px; margin-top: 0% !important"
                  src="../assets/eyeWhite.png"
                />
              </button>
              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #ffbe16; border-color: #ffbe16; height: 37px"
                @click="modificarRol(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-3"
                  style="width: 24.5px; height: 25.75px; margin-top: 0% !important"
                  src="../assets/lapiz.png"
                />
              </button>
              <button
                class="btn btn-primary mx-1"
                type="submit"
                style="background-color: #c01a1a; border-color: #c01a1a; height: 37px"
                @click="confirmar(rol.idRoles)"
              >
                <img
                  class="img-fluid mb-1"
                  style="width: 24.5px; height: 22.75px"
                  src="../assets/basura.png"
                />
              </button>
            </div>
          </th>
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
          <h5 class="modal-title" id="exampleModalLabel">Permisos del Rol</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-for="item in permisosDeRolArray">
            <span>{{ item.Descripcion }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="modalCon"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Permisos del Rol</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>¿Está seguro de que quiere eliminar este permiso?</span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="eliminarRoles(idRolEliminar)"
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
.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
}
</style>
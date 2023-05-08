<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { usuariosStore } from '../stores/usuarios';
import { catalogoStore } from '../stores/catalogo';
//import { prospectosStore } from '../stores/prospectos';
import { loginStore } from '../stores/login';
import CompHeader from "../components/Header.vue";
import router from "../router";

const { obtenerUnUser } = usuariosStore();
const { obtenerUnModelo } = catalogoStore();


//Variables reactivas
const idEmpleado = ref("");
const nombreEmpleado = ref("");
const prospectos = ref([]);
const prospectosDesplegados = ref([]);

var modal;

onMounted( async() => {

});

const consultarClienteBAZ = async() => {

}
const consultarNombre = async() => {

}
const consultarPaterno = async() => {

}
const consultarMaterno = async() => {

}
const consultarModelo = async() => {

}
const consultarContacto = async() => {

}
///Si no es gerente solo se deben mostrar sus prospectos
const consultarEmpleado = async() => {

}
const consultarTelefono = async() => {

}
const consultarCorreo = async() => {

}

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
            <div class="col-7 mb-3 pt-5">
                <div class="row align-items-end">
                <p class="italika" style="font-size: 50px">Prospectos</p>
                </div>
                <div class="row">
                <h5 class="italika d-flex justify-content-start">Prospectos registrados</h5>
                </div>
            </div>
            <div class="col-4 pt-4">
                <div class="row d-flex align-items-center pt-2">
                    <input
                        id="myInput"
                        v-on:keyup="myFunction"
                        type="text"
                        class="form-control rounded-pill mt-4"
                        style="width: 300px; height: 50px; border-color: #5e5e5e"
                        placeholder="Buscar"
                    />
                </div>
                <div class="row pt-3">
                    <div class="col-1"></div>
                    <div class="col-6 d-flex align-items-center">
                        <h5 class="italika mt-3 d-flex justify-content-end">Agregar Prospecto</h5>
                    </div>

                    <div class="col d-flex align-items-center">
                        <router-link to="../crearUsuario" style="text-decoration: none">
                        <button
                            class="btn btn-primary mt-2 d-flex align-items-center justify-content-center"
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
                </div>
            </div>
        </div>
        <div class="table-responsive-sm">
            <table
            id="myTable"
            class="table table-hover table-striped text-center mt-4 mx-auto"
            style="width: 950px; overflow-x: auto;"
            >
                <thead>
                    <tr style="background-color: #2b4677; color: white; vertical-align: middle">
                        <th scope="col-3">No.Cliente BAZ</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido Paterno</th>
                        <th scope="col">Apellido Materno</th>
                        <th scope="col">Modelo Italika</th>
                        <th scope="col">Medio de contacto</th>
                        <th scope="col">Vendedor</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Comentario</th>
                        <th scope="col">Fecha de registro</th>
                        <th scope="col" class="sticky" style="position: sticky; right: 0">
                            Opciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="prospecto in prospectosDesplegados" :key="prospecto.idProspectos">
                        <td>{{ consultarClienteBAZ(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ consultarNombre(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ consultarPaterno(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ consultarMaterno(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ consultarModelo(prospecto.Moto_idMoto) }}</td>
                        <td>{{ consultarContacto(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ consultarEmpleado(prospecto.Empleados_idEmpleados) }}</td>
                        <td>{{ consultarTelefono(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ consultarCorreo(prospecto.Clientes_idClientes) }}</td>
                        <td>{{ prospecto.Comentario }}</td>
                        <td>{{ prospecto.Fecha_registro }}</td>
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
                                style="
                                background-color: #c01a1a;
                                border-color: #c01a1a;
                                height: 37px;
                                width: 45px;
                                margin-top: 0% !important;
                                "
                                @click="mostrarmodal(usuario.Usuario, usuario.idEmpleados)"
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
</template>
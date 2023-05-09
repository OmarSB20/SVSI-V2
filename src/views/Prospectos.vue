<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { usuariosStore } from '../stores/usuarios';
import { catalogoStore } from '../stores/catalogo';
import { clientesStore } from '../stores/clientes';
import { prospectosStore } from '../stores/prospectos'
import { loginStore } from '../stores/login';
import { rolesStore } from '../stores/roles';
import CompHeader from "../components/Header.vue";
import router from "../router";

const { obtenerRolesN } = rolesStore();
const { obtenerUnUser } = usuariosStore();
const { obtenerUsuarios } = usuariosStore();
const { consultarMotocicletas } = catalogoStore();
const { obtenerCliente } = clientesStore();
const { obtenerTodosClientes } = clientesStore();
const { getIdCliente } = prospectosStore();
const { obtenerProspectos } = prospectosStore();
const { obtenerProspecto } = prospectosStore();
const { getIdProspecto } = prospectosStore();
const { setIdProspecto } = prospectosStore();
const { eliminarProspecto } = prospectosStore();
const { getUser } = loginStore();

//Variables reactivas
const nivelUsuario = ref([]);
const idEmpleado = ref("");
const nombreEmpleado = ref("");
const prospectos = ref([]);
const prospectosDesplegados = ref([]);
const usuarioActual = ref("Gerente");
const usuarios = ref([]);
const idUsuario = ref("");
const clientes = ref([]);
const motos = ref([]);
const superUsuario = ref();
const nombre = ref("");

var modal;

onMounted( async() => {
    motos.value = await consultarMotocicletas();
    motos.value = motos.value.data.body;
    clientes.value = await obtenerTodosClientes();
    clientes.value = clientes.value.data.body;
    await consultarUsuarioAct();
    await consultarAcceso();
});

//Consultar el id de el empleado que accede a prospectos
const consultarUsuarioAct = async() => {
    try{
        //usuarioActual.value = await getUser();
        usuarios.value = await obtenerUsuarios();
        usuarios.value = usuarios.value.data.body;
        for(var i in usuarios.value){
            if (usuarioActual.value == usuarios.value[i].Usuario){
                idUsuario.value = usuarios.value[i].Roles_idRoles;
                console.log(idUsuario.value);
            }
        }
        nivelUsuario.value = await obtenerRolesN(idUsuario.value);
        nivelUsuario.value = nivelUsuario.value.data.body;
        console.log(nivelUsuario.value);
    }catch(error){
        console.log(error);
    }
};

//Ver que tanto acceso tiene a la informacion este empleado
const consultarAcceso = async() => {
    try{
        console.log(nivelUsuario.value[0].SuperRol);
        if(nivelUsuario.value[0].SuperRol == 1){
            await consultarProspectos();
            superUsuario.value = true;
                console.log(superUsuario.value);
        }else{
            await consultarProspectosLimitado();
            superUsuario.value = false;
            console.log(superUsuario.value);
        }
    }catch(error){
        console.log(error);
    }
};

const consultarProspectos = async() => {
    try{
        prospectos.value = await obtenerProspectos();
        prospectos.value = prospectos.value.data.body;
        prospectosDesplegados.value = prospectos.value;
        console.log(prospectosDesplegados.value);
    }catch(error) {
        console.log(error);
    }
};

const consultarProspectosLimitado = async() => {
    try{
        prospectos.value = await obtenerProspectos();
        prospectos.value = prospectos.value.data.body;
        for(var i in prospectos.value){
            if(prospectos.value[i].Empleados_idEmpleados == idUsuario.value){
                prospectosDesplegados.value.push(prospectos.value[i]);
            }
        }
        console.log(prospectosDesplegados.value);
    }catch(error){
        console.log(error);
    }
};

const actualizarTabla = (nombre) => {

};

const modificarProspecto = (idProspecto) => {
    setIdProspecto(idProspecto);
    //router.push();
};

const agregarProspecto = () => {
    //router.push();
};

const eliminar = async (idProspecto) => {
    try{
        await eliminarProspecto(idProspecto);
    }catch(error){
        console.log(error);
    }
    consultarAcceso();
};

const consultarClienteBAZ = (idCliente) => {
        const clienteBAZ = clientes.value.find((cliente) => cliente.idClientes == idCliente);
        console.log(clienteBAZ.NoClienteBAZ);
        return clienteBAZ.NoClienteBAZ;
};

const consultarNombre = (idCliente) => {
        const clienteN = clientes.value.find((cliente) => cliente.idClientes == idCliente);
        return clienteN.Nombre;
};
const consultarPaterno = (idCliente) => {
        const clienteP = clientes.value.find((cliente) => cliente.idClientes == idCliente);
        return clienteP.Apellido_Paterno;
};
const consultarMaterno = (idCliente) => {
    const clienteM = clientes.value.find((cliente) => cliente.idClientes == idCliente);
    return clienteM.Apellido_Materno;
};
const consultarModelo = (idMoto) => {
    console.log(motos.value);
    const modeloM = motos.value.find((moto) => moto.idMoto == idMoto);
    return modeloM.Modelo;
};
const consultarContacto = async(idContacto) => {
    try{

    }catch(error){

    }
};
///Si no es gerente solo se deben mostrar sus prospectos
const consultarEmpleado = (idEmpleado) => {
    const empleado = usuarios.value.find((usuario) => usuario.idEmpleados == idEmpleado);
    return empleado.Usuario;
};
const consultarTelefono = (idCliente) => {
        const clienteT = clientes.value.find((cliente) => cliente.idClientes == idCliente);
        return clienteT.Telefono;
};
const consultarCorreo = (idCliente) => {
        const clienteC = clientes.value.find((cliente) => cliente.idClientes == idCliente);
        return clienteC.Correo;
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
                        type="text"
                        class="form-control rounded-pill mt-4"
                        style="width: 300px; height: 50px; border-color: #5e5e5e"
                        placeholder="Buscar"
                        v-model.trim="nombre"
                        @input="actualizarTabla(nombre)"
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
            style="width: 850px; overflow-x: auto;"
            >
                <thead>
                    <tr style="background-color: #2b4677; color: white; vertical-align: middle">
                        <th scope="col-3">No.Cliente BAZ</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido Paterno</th>
                        <th scope="col">Apellido Materno</th>
                        <th scope="col">Modelo Italika</th>
                        <th scope="col">Medio de contacto</th>
                        <th v-if="superUsuario == true" scope="col">Vendedor</th>
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
                        <td>{{ consultarContacto(prospecto.MedioDeContacto_idMedioDeContacto) }}</td>
                        <td v-if="superUsuario==true">{{ consultarEmpleado(prospecto.Empleados_idEmpleados) }}</td>
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
                                @click="modificarProspecto(prospecto.idProspectos)"
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
                                @click="eliminar(prospecto.idProspectos)"
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
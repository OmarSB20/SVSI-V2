<script setup>

import { ref } from 'vue';
import { onMounted } from "vue";
import { clientesStore } from "../stores/clientes";
import { catalogoStore } from "../stores/catalogo";
import { loginStore } from "../stores/login";
import { prospectosStore } from "../stores/prospectos";
import { asesoresStore } from "../stores/asesores";
import { creditosStore } from "../stores/creditos";
import { estatusCotizacionStore } from "../stores/estatusCotizacion";
import { cotizacionesStore } from "../stores/cotizaciones";
import router from '../router';
import CompHeader from '../components/Header.vue';

const { obtenerNombresCreditos } = creditosStore();
const { obtenerNombresEstatusCotizacion } = estatusCotizacionStore();
const { consultarMotocicletasActivas } = catalogoStore();
const { obtenerAsesoresActivos } = asesoresStore();
const { obtenerProspectos } = prospectosStore();

//Variables
const visita = ref(true);
const divs = ref([]);
const nombre = ("");
const aPaterno = ("");
const aMaterno = ("");
const tCredito = ("");
const estatus = ("");
const motos = ([]);
const assrBaz = ("");
const telefono = ("");
const correo = ("");
const pagoInicial = ("");
const capacidad = ("");
const nBaz = ("");
const hInicial = ("");
const hFinal = ("");
const comentario = ("");

const catalogo = ref();
const estatusCotizaciones = ref();
const tiposCreditos = ref();
const asesores = ref();
const deshabilitado = ref(false);
const repetido = ref(false);
const idProspecto = ref(null);
const idUser = ref(null);

var modal;
var tried = false;
const validado = ref(true);
const alertaLlenado = ref(false);
const esNuevo = ref();
const canActualizar = ref(false);

onMounted(async () => {
    llenarCombos();

    await obtenerCreditos();
    await obtenerMotos();
    await obtenerCotizaciones();
    await obtenerAsesores();
});

const obtenerCreditos = async () => {
    tiposCreditos.value = (await obtenerNombresCreditos()).data.body;
};

const obtenerMotos = async () => {
    catalogo.value = (await consultarMotocicletasActivas()).data.body;
};

const obtenerCotizaciones = async () => {
    estatusCotizaciones.value = (await obtenerNombresEstatusCotizacion()).data.body;
};

const obtenerAsesores = async () => {
    asesores.value = (await obtenerAsesoresActivos()).data.body;
};

const agregarMoto = () => {
    divs.value.push({});
};

const eliminarMoto = (index) => {
    console.log(index);
    divs.value.splice(index,1);
};

function llenarCombos() {
  console.log("llenando combos")
  const config = {
    search: true,
    clearable: true
  };
  let select = document.getElementById("select1");
  mediosContacto.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Descripcion;
    optionElement.value = option.idMedioDeContacto;
    select.add(optionElement);
  });

  dselect(tagMedio.value, config); //si jala, no mover xd

  select = document.getElementById("select2");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd

  select = document.getElementById("select3");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd

  select = document.getElementById("select4");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd

  select = document.getElementById("select5");
  catalogo.value.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.text = option.Modelo;
    optionElement.value = option.idMoto;
    select.add(optionElement);
  });

  dselect(tagMoto.value, config); //si jala, no mover xd
  console.log("acabando Llenar combos")
};

</script>
<template>
    <form @submit.prevent="crearRol(rolNuevo)">
        <div class="container-fluid">
            <CompHeader/>
            
            <!-- Row 1-->
            <div class="row d-flex align-items-center mb-3">
                <div class="col-1 d-flex justify-content-end">
                    <router-link to="/roles">
                        <img
                        class="img-fluid mb-3"
                        style="margin-top: 20px; width: 31.23px; height: 35.5px"
                        src="../assets/triangulito.png"
                        />
                    </router-link>
                </div>
                <div class="col-4 ms-4 pt-4">
                    <p class="italika d-flex align-items-center" style="font-size: 50px">
                        Agregar Cotizacion
                    </p>
                </div>
                <div class="col-1"></div>
            </div>

            <!--  RowBotones -->
            <div class="row d-flex align-items-center mb-5">
                <div class="col-2"></div>
                <div class="col-2 d-flex align-items-center justify-content-center">
                    <button type="button" class="btn btn-success" @click="seleccionCliente()" style="height: 50px; width: 180px">
                        Seleccionar cliente
                    </button>
                </div>
                <div class="col-1"></div>
                <div class="col-2 d-flex align-items-center justify-content-center">
                    <button type="button" class="btn btn-success" @click="seleccionCliente()" style="height: 50px; width: 180px">
                        Crear cliente
                    </button>
                </div>
                <div class="col-1"></div>
                <div class="col-2 d-flex align-items-center justify-content-center">
                    <button type="button" class="btn btn-success" @click="seleccionCliente()" style="height: 50px; width: 180px">
                        Limpiar
                    </button>
                </div>
            </div>
            <!-- Row2 -->
            <div class="row d-flex align-items-center mb-3">
                <div class="col-2 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end">Nombre:</h5>
                </div>
                <div class="col-5">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="nombre"
                        @input="validarTexto(nombre)"
                        ref="tagNombre"
                        
                    />
                </div>
            </div>
            <!-- Row3 -->
            <div class="row d-flex align-items-center mb-2">
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end ps-5">
                        Apellido Paterno:
                    </h5>
                </div>
                <div class="col-3">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="aPaterno"
                        @input="validarTexto(aPaterno)"
                        ref="tagNombre"
                        
                    />
                </div>
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end ps-5">
                        Apellido Materno:
                    </h5>
                </div>
                <div class="col-3">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="aMaterno"
                        @input="validarTexto(aMaterno)"
                        ref="tagNombre"
                        
                    />
                </div>
            </div>
            <!-- Row4 -->
            <div class="row d-flex align-items-center mb-2">
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end ps-3">
                        Tipo de Credito:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto">
                  <select
                    :class="motoValida"
                    id="select1"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 310px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Estatus:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto">
                  <select
                    :class="motoValida"
                    id="select2"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 430px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
            </div>
            <!-- Row5 -->
            <div class="row d-flex align-items-center mb-3">
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Motocicleta:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto">
                  <select
                    :class="motoValida"
                    id="select3"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 310px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
            <!-- Boton agregar mas motos-->
                <div class="col-1 d-flex justify-content-center">
                    <button
                        class="btn btn-primary"
                        style="width: 100%"
                        type="submit"
                        @click="agregarMoto()"
                        
                    >
                        Agregar
                    </button>
                </div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end ps-3">
                        Asesor BAZ:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto">
                  <select
                    :class="motoValida"
                    id="select4"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 430px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
            </div>
            <!--  Div Motos -->
            <div class="row d-flex align-items-center mb-4" v-for="(div, index) in divs" :key="index">
                <div class="col-1" id="motos"></div>
                <div class="col-1" id="motos">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Motocicleta:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto" id="motos">
                  <select
                    :class="motoValida"
                    id="select5"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 310px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
            <!-- Boton agregar mas motos-->
                <div class="col-1 d-flex justify-content-center" id="motos">
                    <button
                        class="btn btn-primary"
                        style="width: 100%"
                        type="submit"
                        @click="eliminarMoto(index)"
                        
                    >
                        Eliminar
                    </button>
                </div>
            </div>
            <!-- Row6 -->
            <div class="row d-flex align-items-center mb-3">
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Telefono:
                    </h5>
                </div>
                <div class="col-3">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="telefono"
                        @input="validarTexto(telefono)"
                        ref="tagNombre"
                        
                    />
                </div>
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Correo:
                    </h5>
                </div>
                <div class="col-4">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="correo"
                        @input="validarTexto(correo)"
                        ref="tagNombre"
                        
                    />
                </div>
            </div>
            <!-- Row7 -->
            <div class="row d-flex align-items-center mb-3">
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end ps-3">
                        Pago inicial:
                    </h5>
                </div>
                <div class="col-2">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="pagoInicial"
                        @input="validarTexto(pagoInicial)"
                        ref="tagNombre"
                        
                    />
                </div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end">
                        Capacidad:
                    </h5>
                </div>
                <div class="col-2">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="capacidad"
                        @input="validarTexto(capacidad)"
                        ref="tagNombre"
                        
                    />
                </div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end ps-3">No. Cliente BAZ:</h5>
                </div>
                <div class="col-3">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="nBaz"
                        @input="validarTexto(nBaz)"
                        ref="tagNombre"
                        
                    />
                </div>
            </div>
            <!-- Div Visita-->
            <div class="row d-flex align-items-center mb-4" v-if="visita">
                <div class="col-1"></div>
                <div class="col-2 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Hora Inicial de visita:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto" id="motos">
                  <select
                    :class="motoValida"
                    id="select5"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 200px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
                <div class="col-1"></div>
                <div class="col-2 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Hora Final de visita:
                    </h5>
                </div>
                <div class="col-3" ref="tagBordeMoto" id="motos">
                  <select
                    :class="motoValida"
                    id="select5"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 200px;"
                  >
                    <option value="-1">Seleccionar</option>
                  </select>
                </div>
            </div>
            
            <!-- Row 8 -->
            <div class="row d-flex align-items-center mb-3">
                <div class="col-1"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Comentario:
                    </h5>
                </div>
                <div class="col-9">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="comentario"
                        @input="validarTexto(comentario)"
                        ref="tagNombre"
                        style="height: 100px;"
                    />
                </div>
            </div>
            <!-- Row9 -->
            <div class="row mb-2 pb-2 mt-4">
                <div class="col d-flex justify-content-center">
                    <button
                        class="btn btn-primary"
                        style="width: 15%"
                        type="submit"
                        :disabled="deshabilitado"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </form>
</template>
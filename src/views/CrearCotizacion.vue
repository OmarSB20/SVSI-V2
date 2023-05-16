<script setup>

import { ref } from 'vue';
import router from '../router';
import CompHeader from '../components/Header.vue';

const showMotos = ref(false);
const divs = ref([]);

const agregarMoto = () => {
    divs.value.push({});
}
const eliminarMoto = (index) => {
    divs.value.splice(index,1);
}
</script>
<template>
    <form @submit.prevent="crearRol(rolNuevo)">
        <div class="container-fluid">
            <CompHeader/>
            <!-- Row 1-->
            <div class="row d-flex align-items-center mb-5">
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
                <div class="col-2 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end">No. Cliente BAZ:</h5>
                </div>
                <div class="col-3">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
                        ref="tagNombre"
                        
                    />
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
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
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
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
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
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
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
                    id="select2"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 300px;"
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
                    style="height: 40px; width: 300px;"
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
                    id="select2"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 300px;"
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
                    id="select2"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 440px;"
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
                    id="select2"
                    @change="validarMoto()"
                    ref="tagMoto"
                    style="height: 40px; width: 300px;"
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
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
                        ref="tagNombre"
                        
                    />
                </div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end pe-2">
                        Correo:
                    </h5>
                </div>
                <div class="col-4">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
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
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
                        ref="tagNombre"
                        
                    />
                </div>
                <div class="col-2"></div>
                <div class="col-1 d-flex justify-content-end pt-2">
                    <h5 class="italika d-flex justify-content-end">
                        Capacidad:
                    </h5>
                </div>
                <div class="col-2">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
                        ref="tagNombre"
                        
                    />
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
                <div class="col-8">
                    <input
                        type="text"
                        class="form-control input-f inptElement"
                        v-model.trim="BAZ"
                        @input="validarTexto(tagNombre)"
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
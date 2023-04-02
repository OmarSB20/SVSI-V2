<script>
import { ref } from "vue";
import { onMounted } from "vue";
import router  from '../router/index'
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
                <div class="row align-items-start">
                <p class="italika" style="font-size: 50px">Actualizar Usuario</p>
                </div>
            </div>
        </div>
        <div class="row container">
            <div class="col-2"></div>
            <div class="col-8 ml-8">
                <p class="italika" style="font-size: 50px">Actualizar Usuario</p>
            </div>
        </div>
    </div>
</template>
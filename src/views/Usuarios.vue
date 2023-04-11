<script setup>
</script>

<template>
    <!-- contenedor de italika -->
    <div class="container-fluid">
        <div class="row" style="background-color: black" height="100px">
            <div class="col-10">
                <img class="img-fluid mt-1" style="width: 335px; height: 80px" src="../assets/LogoItalikaRamos.png" />
            </div>
            <div class="col">
                <p style="font-size: 60px" class="italika d-flex justify-content-start mb-0">
                    SVSI
                </p>
            </div>
        </div>

        <!-- imagen triangulo  -->
        <div class="row ">
            <div class="col-1 mb-3 pt-5">
                <a href="http://localhost:5173">
                    <img class="img-fluid mt-3" style="margin-top: 20px; width: 31.23px; height: 35.5px"
                        src="../assets/triangulito.png" />
                </a>
            </div>
            <!-- texto usuario y usuario registrado -->
            <div class="col-8 mb-3 pt-5">
                <div class="row align-items-end">
                    <p class="italika" style="font-size: 50px">Usuarios</p>
                </div>
                <div class="row align-items-end">
                    <h5 class="italika d-flex justify-content-start">Usuarios Registrados</h5>
                </div>
            </div>


            <div class="col-3 align-items-end ">
                <div class="row align-items-end pt-2">
                    <input type="text" class="form-control rounded-pill mt-4"
                        style="width: 250px; height: 50px; border-color: #5e5e5e" placeholder="🔍 Buscar" v-model="nombre"
                        @input="actualizarTabla(nombre)" />
                </div>
                <div class="row">
                    <div class="col-6">
                        <h5 class="italika mt-3">Agregar Nuevo</h5>
                    </div>
                    <div class="col-1">
                        <!-- nombre al que me enlaza -->
                        <router-link to="../">
                            <button class="btn btn-primary mt-2 d-flex align-items-center" type="submit" style="
                        background-color: #66d054;
                        width: 40px;
                        height: 40px;
                        border-color: #5e5e5e;
                      ">
                                <h4>+</h4>
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- empieza la tabla -->
    <table class="table table-hover table-striped text-center mt-4 mx-auto" style="width: 900px">
        <thead>
            <tr style="background-color: #2b4677; color: white">
                <th scope="col">Usuario</th>
                <th scope="col">Nombres</th>
                <th scope="col">Apellido Paterno</th>
                <th scope="col">Apellido Materno</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Contraseña</th>
                <th scope="col">Telefono</th>
                <th scope="col">Telefono</th>
                <!-- <th scope="col" style="width: 100px">Acceso</th> -->
            </tr>
        </thead>

        <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Otto</td>
            <td>@mdo</td>
        </tr>
    </table>
</template>
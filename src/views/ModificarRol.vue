<script setup>
    
</script>
<template>
    <div class="container-fluid" >
        <div class="row" style="background-color: black;" height="100px">
            <div class="col-10">

            </div>
            <div class="col">
                <p style="color: white; font-size: 60px" class="mb-0">SVSI</p>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col-1">
                <!-- regresar -->
                <p style="color: white;">flecha</p>
            </div>
            <div class="col-8">
                <div class="row">
                    <!-- roles -->
                    <p style="color: white; font-size: 40px">Roles</p>
                </div>
                <div class="row">
                    <!-- roles registadros-->
                    <p style="color: white; font-size: 20px">Roles registrados</p>
                </div>
            </div>
            <div class="col-3">
                <div class="row">
                    <!-- buscador -->
                    <p>buscador</p>
                </div>
                <div class="row">
                    <!-- agregar -->
                    <p style="color: white; font-size: 20px">Agregar nuevo</p>
                </div>
            </div>
        </div>
        <!-- tabla -->
        <table style="color: white;" class="table">
            <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>
            </tr>
            <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
            </tr>
            <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
            </tr>
        </table>
    </div>
</template>

<style>
body{
    margin: 0;
    padding: 0;
    background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);
    min-height: 100vh;
}
.italika{
    font-family: "Fjalla One";
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.04em;
}
</style>
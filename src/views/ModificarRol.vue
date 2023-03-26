<script setup>
import { onMounted, VueElement } from 'vue';

data(() => {
  return{
    roles: []
  }
})

onMounted(() => {
  fetch('../jason/roles.json')
    .then(response => response.json())
    .then( data => {
      this.roles = data.body
    })
})

</script>
<template>
    <div class="container-fluid" >
        <div class="row" style="background-color: black;" height="100px">
            <div class="col-10">

            </div>
            <div class="col">
                <p style="font-size: 60px" class="italika d-flex justify-content-start mb-0">SVSI</p>
            </div>
        </div>
        <div class="row">
            <div class="col-1">
                <img
                    class="img-fluid mt-3"
                    style="margin-top: 20px; width: 31.23px; height: 35.5px"
                    src="../assets/triangulito.png"
                />
            </div>
            <div class="col-8">
                <div class="row align-items-end">
                    <p class="italika" style="font-size: 50px">
                        Roles
                    </p>
                </div>
                <div class="row align-items-end">
                    <h5 class="italika d-flex justify-content-start">
                        Registrar Roles
                    </h5>
                </div>
            </div>
            <div class="col-3 align-items-end">
                <div class="row align-items-end">
                    <input type="text" class="form-control rounded-pill mt-4" style="width: 250px; height: 50px; border-color: #5e5e5e">
                </div>
                <div class="row">
                  <div class="col-6">
                    <h5 class="italika mt-3">
                        Agregar Roles
                    </h5>
                  </div>
                  <div class="col-1">
                    <button class="btn btn-primary mt-2 d-flex align-items-center" type="submit"
                    style="background-color: #66D054; width: 40px; height: 40px; border-color: #5e5e5e"><h4>+</h4></button>
                  </div>
                </div>
            </div>
        </div>
        <table
            class="table table-hover table-striped text-center mt-4 mx-auto"
            style="width: 900px"
          >
            <thead>
              <tr style="background-color: #2b4677; color: white">
                <th scope="col">Nombre</th>
                <th scope="col" style="width: 100px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rol in roles">
                <td>
                {{ rol.Nombre }}
                </td>
                <th scope="row">
                  <div class="align-items-center">
                    <button class="btn btn-primary" type="submit"
                    style="background-color: #59C01A; border-color: #59C01A; height: 25px;"></button>
                    <button class="btn btn-primary ml-5" type="submit"
                    style="background-color: #FFBE16; border-color: #FFBE16; height: 25px;"></button>
                    <button class="btn btn-primary" type="submit"
                    style="background-color: #C01A1A; border-color: #C01A1A; height: 25px;"></button>
                  </div>
                </th>
              </tr>
            </tbody>
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
.italika {
  font-family: "Fjalla One";
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #ffffff;
}
</style>
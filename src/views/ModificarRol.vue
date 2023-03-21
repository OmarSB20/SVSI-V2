<script setup>
    
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
        <div class="row align-items-center">
            <div class="col-1">
                <img
                    class="img-fluid"
                    style="margin-top: 20px; width: 31.23px; height: 35.5px"
                    src="../assets/triangulito.png"
                />
            </div>
            <div class="col-8">
                <div class="row">
                    <p class="italika d-flex justify-content-start" style="font-size: 50px">
                        Roles
                    </p>
                </div>
                <div class="row">
                    <h5 class="italika d-flex justify-content-start">
                        Registrar Roles
                    </h5>
                </div>
            </div>
            <div class="col-3">
                <div class="row">
                    <input type="text" class="form-control" style="" />
                </div>
                <div class="row">
                    <h5 class="italika d-flex justify-content-start">
                        Agregar Roles
                    </h5>
                </div>
            </div>
        </div>
        <table
            class="table table-hover table-striped text-center mt-4 mx-auto"
            style="width: 900px"
          >
            <thead>
              <tr style="background-color: #2b4677; color: white">
                <th scope="col">Nombre de permiso</th>
                <th scope="col" style="width: 100px">Acceso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style="
                    border-style: inherit;
                    border-right-color: #2b4677;
                    border-right-width: 2px;
                  "
                >
                  {{ item }}
                </td>
                <th scope="row">
                  <div class="form-check d-flex justify-content-center">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      style="width: 25px; height: 25px; border-color: #5e5e5e"
                    />
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
<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import router  from '../router/index'
</script>

<template>
  <div>
    <nav style="position: fixed; left: 0; top: 0; bottom: 0; width: 450px; opacity: 10; padding: 20px;">
        <div class="container-fluid">
            
            <ul class="nav flex-column">
                <li class="dropdown mb-2">
                    <a class="dropdown-toggle italika" data-toggle="dropdown" href="#">Area de ventas <span class="caret"></span></a>
                    <ul class="dropdown-menu" style="background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);">
                        <li class="dropdown">
                            <a class="dropdown-toggle italika" data-toggle="dropdown" href="#" style="color:white">Prospectos <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a class="italika" style="color:white" href="#">Agregar prospecto</a></li>
                                <li><a class="italika" style="color:white" href="#">Ver prospectos</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a class="dropdown-toggle italika" data-toggle="dropdown" href="#" style="color:white">Cotizaciones <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a class="italika" style="color:white" href="#">Agregar cotizacion</a></li>
                                <li><a class="italika" style="color:white" href="#">Ver cotizaciones</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li class="mb-2"><a class="italika" href="#">Clientes</a></li>
                <li class="mb-2"><a class="italika" href="#">Citas</a></li>
                <li class="dropdown mb-2">
                    <a class="dropdown-toggle italika" data-toggle="dropdown" href="#">Servicios <span class="caret"></span></a>
                    <ul class="dropdown-menu" style="background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);">
                        <li><a class="italika" style="color:white" href="#">Agregar servicio</a></li>
                        <li><a class="italika" style="color:white" href="#">Ver servicios</a></li>
                    </ul>
                </li>
                <li class="dropdown mb-2">
                    <a class="dropdown-toggle italika" data-toggle="dropdown" href="#">Usuarios <span class="caret"></span></a>
                    <ul class="dropdown-menu" style="background-image: linear-gradient(113.96deg, #000103 2.35%, #164193 100%);">
                        <li><a class="italika" style="color:white" href="#">Ver usuarios</a></li>
                        <li><a class="italika" style="color:white" href="#">Ver roles</a></li>
                    </ul>
                </li>
                <li class="mb-2"><a class="italika" href="#">Asesores BAZ</a></li>
                <li class="mb-2"><a class="italika" href="#">Catalogo</a></li>
                <li class="mb-2"><a class="italika" href="#">Meta de ventas</a></li>
                <li class="mb-2"><a class="italika" href="#">Reportes</a></li>
            </ul>
        </div>
    </nav>
    
    <div>
      <!-- contenido principal de la página aquí -->
    </div>
  </div>
</template>

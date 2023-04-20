<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import router from "../router/index";

const classA = ref("nav collapse");

function toggle() {
    if (classA.value=="nav collapse") {
        classA.value="";
        console.log(classA.value)
    }else{
        classA.value="nav collapse";
        console.log(classA.value)
    }
}
</script>

<template>
  <div id="wrapperMenu">
    <ul id="menu-dashboard" class="nav nav-pills nav-stacked">
      <li class="active">
        <a href="#"
          ><span class="icon-home4"></span> <span class="hidden-xs">Inicio</span></a
        >
      </li>
      <li>
        <a href="#"
          ><span class="icon-user3"></span> <span class="hidden-xs">Perfil</span></a
        >
      </li>
      <li>
        <a href="#"
          ><span class="icon-search-2"></span> <span class="hidden-xs"> Buscar</span></a
        >
      </li>
      <li>
        <a href="#"
          ><span class="icon-speacker-1"></span>
          <span class="hidden-xs"> Publicaciones</span>
          <span class="badge pull-right">42</span></a
        >
      </li>
      <li>
        <a href="#"
          ><span class="icon-files"></span> <span class="hidden-xs">Facturación</span></a
        >
      </li>
      <li class="dropdown">
        <a
          href="#"
          class="dropdown-toggle"
          data-toggle="collapse"
          data-target="#submenu"
          aria-expanded="false"
          @click="toggle()"
        >
          <span class="icon-link2"></span>
          Nuevos Link<span class="caret"></span
        ></a>
        <ul class="nav collapse" id="submenu" role="menu" aria-labelledby="btn-1">
          <li><a href="#" >Elementos del Submenu</a></li>
        </ul>
      </li>
      <li>
        <a href="#"
          ><span class="icon-link2"></span> <span class="hidden-xs">Nuevos link</span></a
        >
      </li>
      <li>
        <a href="#"
          ><span class="icon-link2"></span> <span class="hidden-xs">Nuevos link</span></a
        >
      </li>
    </ul>
  </div>
</template>
<style>
#wrapperMenu {
  width: 30%;
  margin: 20px 50px;
}

.wrappernav-dashboard {
  /*background: #d3d3d3;*/
  /*border: 1px dashed orange;*/
  width: 100%;
  padding: 10px;
  margin: 0;
}
#menu-dashboard {
  /*border: 1px dashed red;*/
  border-left: 1px solid #bcbcbc;
  border-right: 1px solid #bcbcbc;
  border-top: 1px solid #bcbcbc;
  border-radius: 5px;
  overflow: hidden;
}
#menu-dashboard .active a {
  background-color: #f4bd16;
  border-radius: 0;
  color: #fff;
}
#menu-dashboard li {
  border-radius: 0;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #bcbcbc;
}
#menu-dashboard li > a {
  border-radius: 0;
  padding: 10px;
  color: #444;
}
#menu-dashboard > li > a:hover,
#menu-dashboard > li > a:focus {
  color: #fff;
  background: #f4bd16;
  -webkit-transition: all 1ms ease-in-out;
  -moz-transition: all 1ms ease-in-out;
  -ms-transition: all 1ms ease-in-out;
  -o-transition: all 1ms ease-in-out;
  transition: all 1ms ease-in-out;
}
#submenu {
  background: #333;
}
#submenu li {
  border: none;
}
#submenu li a {
  color: #fff;
  padding: 10px;
  margin: 0;
  text-indent: 20px;
}
#submenu li a:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>

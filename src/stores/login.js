import { defineStore } from "pinia";
import axios from "axios";

export const loginStore = defineStore("login",{
  state: ()=>({
    token: null,
    usuario:null
  }), 
  actions:{
    async login(usuario){
        try {
            const res = await axios.post('http://localhost:4000/api/usuarios/login',usuario);
            console.log(res);
            console.log(res.data.body.token)
            this.token = res.data.body.token;
            // Save data to sessionStorage
            sessionStorage.setItem("token", this.token);
            this.usuario = usuario.Usuario;
            sessionStorage.setItem("usuario", this.usuario);
            console.log(this.usuario)
            return res.data.body.token != null;
            
        } catch (error) {
            console.log(error)
        }
    },

    getToken(){
      console.log(this.token)
        return this.token;
    },

    getUser(){
      console.log(this.usuario)
        return this.usuario;
    },

    async verificarPermisos(id){
      try {
        console.log(id)
        let config = {headers:{'Authorization':'Bearer '+this.token}}
        const res = await axios.post('http://localhost:4000/api/usuarios/auth',{IdInterfaz:id},config);
        console.log(res.data.body)
        return res.data.body;
      } catch (error) {
        //console.log(error)
        return false
      }
    },

    async reanudarSesion(){
      // Get saved data from sessionStorage
    let data = sessionStorage.getItem("token");
    if (data) {
      this.token = data;
      this.usuario = sessionStorage.getItem("usuario");
      return true;
    }else{
      return false;
    }
    },

    async cerrarSesion(){
      // Remove saved data from sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("usuario");
      this.token = null;
      this.usuario = null;
    }
  } 
})
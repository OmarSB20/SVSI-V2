import { defineStore } from "pinia";
import axios from "axios";

export const rolesStore = defineStore("roles",{
  state: ()=>({
    roles: []
  }), 
  actions:{
    async obtenerRoles(){
        try {
            const res = await axios.get('http://localhost:4000/api/roles')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarRol(nombreRol){
        try {
            const res = await axios.post('http://localhost:4000/api/roles',{"idRoles":0,
            "Nombre":nombreRol
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

  } 
})


  

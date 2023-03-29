import { defineStore } from "pinia";
import axios from "axios";

export const rolesStore = defineStore("roles",{
  state: ()=>({
    roles: [],
    idRolActual:8
  }), 
  actions:{

    setRol(idRol){
        idRolActual = idRol;
    },

    getRol(){
        return this.idRolActual;
    },

    async obtenerRoles(){
        try {
            const res = await axios.get('http://localhost:4000/api/roles')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerRolesN(id){
        try {
            const res = await axios.get('http://localhost:4000/api/roles/'+id)
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
    async actualizarRol(idRoles, nombreRol){
        try {
            const res = await axios.post('http://localhost:4000/api/roles',{"idRoles":idRoles,
            "Nombre":nombreRol
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarRol(idRol){
        try {
            const res = await axios.put('http://localhost:4000/api/roles/'+idRol);

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
  } 
})


  

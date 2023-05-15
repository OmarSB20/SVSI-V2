import { defineStore } from "pinia";
import axios from "axios";

export const rolesStore = defineStore("roles",{
  state: ()=>({
    roles: [],
    idRolActual:null
  }), 
  actions:{

    setRol(idRol){
       
        this.idRolActual = idRol;
        console.log(this.idRolActual)
    },

    getRol(){
        console.log(this.idRolActual)
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

    async agregarRol(nombreRol,superRol){
        try {
            const res = await axios.post('http://localhost:4000/api/roles',{"idRoles":0,
            "Nombre":nombreRol, "SuperRol":superRol, "idEstatusActividad":1
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarRol(idRoles, nombreRol,superRol){
        try {
            const res = await axios.post('http://localhost:4000/api/roles',{"idRoles":idRoles,
            "Nombre":nombreRol, "SuperRol":superRol
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarRol(idRol){
        try{

        const res = await axios.post('http://localhost:4000/api/roles',{"idRoles":idRol,"idEstatusActividad":2
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


  

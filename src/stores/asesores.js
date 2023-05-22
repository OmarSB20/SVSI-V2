import { defineStore } from "pinia";
import axios from "axios";

export const asesoresStore = defineStore("asesores",{
  state: ()=>({
  
  }), 
  actions:{


    async obtenerAsesoresActivos(){
        try {
            const res = await axios.get('http://localhost:4000/api/asesoresBAZ')
            console.log(res)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerTodos(){
        try {
            const res = await axios.get('http://localhost:4000/api/asesoresBAZ/history')
            console.log(res)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },
    async obtenerAsesor(id){
        try {
            const res = await axios.get('http://localhost:4000/api/asesoresBAZ/'+ id)
            console.log(res)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarAsesor(asesor){
        try {
            const res = await axios.post('http://localhost:4000/api/asesoresBAZ',asesor)

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarAsesor(asesor){
        try {
            const res = await axios.post('http://localhost:4000/api/asesoresBAZ',asesor)

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarAsesor(idAsesor){
        try {
            const res = await axios.put('http://localhost:4000/api/asesoresBAZ',{
                "idAsesoresBAZ":idAsesor
        });

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
  } 
})


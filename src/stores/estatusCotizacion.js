import { defineStore } from "pinia";
import axios from "axios";

export const estatusCotizacionStore = defineStore("estatuscotizacion",{
  state: ()=>({
    estatusCotizacion: [],
    idEstatusCotizacionActual:0,
    idEstatusActividad:1
}), 
  actions:{

    setEstatusCotizacion(idEstatusCotizacion){
       
        this.idEstatusCotizacionActual = idEstatusCotizacion;
        console.log(this.idEstatusCotizacionActual)
    },

    getEstatusCotizacion(){
        console.log(this.idEstatusCotizacionActual)
        return this.idEstatusCotizacionActual;
    },

    async obtenerEstatusCotizacion(){
        try {
            const res = await axios.get('http://localhost:4000/api/estatusCotizacion')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerEstatusCotizacionN(id){
        try {
            const res = await axios.get('http://localhost:4000/api/estatusCotizacion/'+id)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarEstatusCotizacion(nombreEstatusCotizacion){
        try {
            const res = await axios.post('http://localhost:4000/api/estatusCotizacion',{"idEstatusCotizacion":0,
            "Descripcion":nombreEstatusCotizacion,"idEstatusActividad":1
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarEstatusCotizacion(idEstatusCotizacion, nombreEstatusCotizacion){
        try {
            const res = await axios.post('http://localhost:4000/api/estatusCotizacion',{"idEstatusCotizacion":idEstatusCotizacion,
            "Descripcion":nombreEstatusCotizacion,"idEstatusActividad":1
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarEstatusCotizacion(idEstatusCotizacion){
        try {
            const res = await axios.put('http://localhost:4000/api/estatusCotizacion/',{
                "idEstatusCotizacion":idEstatusCotizacion, "idEstatusActividad":2
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


  

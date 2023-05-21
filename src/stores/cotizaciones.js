import { defineStore } from "pinia";
import axios from "axios";

export const cotizacionesStore = defineStore("servicios",{
  state: ()=>({
    idCotizaciones:null
   
  }), 
  actions:{
    setIdCotizacion(id){
        this.idCotizaciones = id;
        console.log(this.idCotizaciones)
    },

    getIdCotizacion(){
        console.log(this.idCotizaciones)
        return this.idCotizaciones;
    },
    async cotizacionExiste(cotizacion){
        try {
            const res = await axios.post('http://localhost:4000/api/cotizaciones/existe',cotizacion)
            console.log(res.data.body)
            return res.data.body;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerCotizaciones(){
        try {
            const res = await axios.get('http://localhost:4000/api/cotizaciones')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerCotizacion(id){
        try {
            const res = await axios.get('http://localhost:4000/api/cotizaciones/'+id)
            return res;
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarCotizacion(cotizacion){
        try {
            const res = await axios.post('http://localhost:4000/api/cotizaciones',cotizacion)
            console.log(res)
            return ;
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarCotizacion(cotizacion){
        try {
            const res = await axios.post('http://localhost:4000/api/cotizaciones',cotizacion)
           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarCotizacion(idCotizaciones){
        try {
            const res = await axios.put('http://localhost:4000/api/cotizaciones/',{
                "idCotizaciones":idCotizaciones
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
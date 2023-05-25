import { defineStore } from "pinia";
import axios from "axios";

export const metaVentasStore = defineStore("metaVentas",{
  state: ()=>({
  
  }), 
  actions:{


    async obtenerTodas(){
        try {
            const res = await axios.get('http://localhost:4000/api/metaVentas')
            console.log(res)
            return res.data.body;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },
   
    async obtenerMetaActual(){
        try {
            const res = await axios.get('http://localhost:4000/api/metaVentas/metaActual');
            return res.data.body;
        } catch (error) {
            console.log(error)
        }
    },

    async agregarMeta(meta){
        try {
            const res = await axios.post('http://localhost:4000/api/metaVentas',meta)

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarMeta(meta){
        try {
            const res = await axios.post('http://localhost:4000/api/metaVentas',meta)

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

  } 
})

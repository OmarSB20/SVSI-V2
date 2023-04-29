import { defineStore } from "pinia";
import axios from "axios";

export const creditosStore = defineStore("tipos_de_creditos",{
  state: ()=>({
    creditos: [],
    idCreditoActual:0
  }), 
  actions:{

    setCredito(idTipos_De_Creditos){
       
        this.idCreditoActual = idTipos_De_Creditos;
        console.log(this.idCreditoActual)
    },

    getCredito(){
        console.log(this.idCreditoActual)
        return this.idCreditoActual;
    },

    async obtenerCredito(){
        try {
            const res = await axios.get('http://localhost:4000/api/creditos')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerCreditosN(id){
        try {
            const res = await axios.get('http://localhost:4000/api/creditos/'+id)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarCredito(nombreCredito){
        try {
            
            const res = await axios.post('http://localhost:4000/api/creditos',{"idTipos_De_Creditos":0,
            "Descripcion":nombreCredito,
            "idEstatusActividad":1
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarCredito(idTipos_De_Creditos, nombreCredito){
        try {
            console.log(idTipos_De_Creditos);
            console.log(nombreCredito);
            const res = await axios.post('http://localhost:4000/api/creditos',{"idTipos_De_Creditos":idTipos_De_Creditos,
            "Descripcion":nombreCredito
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarCredito(idTipos_De_Creditos){
        try {
            const res = await axios.put('http://localhost:4000/api/creditos/',{
                "idTipos_De_Creditos":idTipos_De_Creditos
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
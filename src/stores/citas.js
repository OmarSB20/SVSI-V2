import { defineStore } from "pinia";
import axios from "axios";

export const CitasStore = defineStore("Citas",{
  state: ()=>({
    dia:null,
    cita:null
  }), 
  actions:{
    getCita(){
        return this.cita;
    },

    setCita(citaObj){
        this.cita = citaObj;
    },

    setDia(diaObj){
        this.dia = diaObj;
    },

    getDia(){
        return this.dia;
    },

    async obtenerTodos(){
        try {
            const res = await axios.get('http://localhost:4000/api/Citas')
            console.log(res)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerUno(id){
        try {
            const res = await axios.get('http://localhost:4000/api/Citas/'+id)
            console.log(res)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarCita(Cita){
        try {
            const res = await axios.post('http://localhost:4000/api/Citas',Cita)

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarCita(Cita){
        try {
            const res = await axios.post('http://localhost:4000/api/Citas',Cita)

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarCita(idCita){
        try {
            const res = await axios.put('http://localhost:4000/api/Citas',{
                "idCitas":idCita
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


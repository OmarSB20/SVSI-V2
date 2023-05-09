import { defineStore } from "pinia";
import axios from "axios";

export const prospectosStore = defineStore("prospectos",{
  state: ()=>({
    idProspectos:null,
    idClientes:null
  }), 
  actions:{
    setIdProspecto(id){
        this.idProspectos = id;
        console.log(this.idProspectos)
    },

    getIdProspecto(){
        console.log(this.idProspectos)
        return this.idProspectos;
    },

    setIdCliente(id){
        this.idClientes = id;
        console.log(this.idClientes)
    },

    getIdCliente(){
        console.log(this.idClientes)
        return this.idClientes;
    },

    async prospectoExiste(prospecto){
        try {
            const res = await axios.post('http://localhost:4000/api/prospectos/existe',prospecto)
            return res.data.body;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerProspectos(){
        try {
            const res = await axios.get('http://localhost:4000/api/prospectos')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerProspecto(id){
        try {
            const res = await axios.get('http://localhost:4000/api/prospectos/'+id)
            return res;
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarProspecto(prospecto){
        try {
            const res = await axios.post('http://localhost:4000/api/prospectos',prospecto)
            console.log(res)
            return ;
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarProspecto(prospecto){
        try {
            const res = await axios.post('http://localhost:4000/api/prospectos',prospecto)
           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarProspecto(idProspectos){
        try {
            const res = await axios.put('http://localhost:4000/api/prospectos/',{
                "idProspectos":idProspectos
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
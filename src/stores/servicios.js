import { defineStore } from "pinia";
import axios from "axios";

export const serviciosStore = defineStore("servicios",{
  state: ()=>({
    idServicios:null,
    idClientes:null
  }), 
  actions:{
    setIdServicios(id){
        this.idServicios = id;
        console.log(this.idServicios)
    },

    getIdServicios(){
        console.log(this.idServicios)
        return this.idServicios;
    },
    setIdCliente(id){
        this.idClientes = id;
        console.log(this.idClientes)
    },

    getIdCliente(){
        console.log(this.idClientes)
        return this.idClientes;
    },
    async servicioExiste(servicio){
        try {
            const res = await axios.post('http://localhost:4000/api/servicios/existe',servicio)
            console.log(res.data.body)
            return res.data.body;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerServicios(){
        try {
            const res = await axios.get('http://localhost:4000/api/servicios')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerServicio(id){
        try {
            const res = await axios.get('http://localhost:4000/api/servicios/'+id)
            return res;
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async consultarServiciosActivas() {
        try {
            const res = await axios.get('http://localhost:4000/api/servicios/activas')
            return res;
        }catch(error){
            console.log(error)
            throw(error);
        }
    },

    async agregarServicio(servicio){
        try {
            const res = await axios.post('http://localhost:4000/api/servicios',servicio)
            console.log(res)
            return ;
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarServicio(servicio){
        try {
            const res = await axios.post('http://localhost:4000/api/servicios',servicio)
           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarServicio(idServicios){
        try {
            const res = await axios.put('http://localhost:4000/api/servicios/',{
                "idServicios":idServicios
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
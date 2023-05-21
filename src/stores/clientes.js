import { defineStore } from "pinia";
import axios from "axios";

export const clientesStore = defineStore("clientes",{
  state: ()=>({
    idClientes:null,
    interfazOrigen:null
  }), 
  actions:{
    setIdCliente(id){
        this.idClientes = id;
        console.log(this.idClientes)
    },

    getIdCliente(){
        console.log(this.idClientes)
        return this.idClientes;
    },
    setInterfazOrigen(interfaz){
        this.interfazOrigen = interfaz;
        console.log(this.interfazOrigen)
    },

    getInterfazOrigen(){
        console.log(this.interfazOrigen)
        return this.interfazOrigen;
    },

    async clienteExiste(cliente){
        try {
            const res = await axios.post('http://localhost:4000/api/clientes/existe',cliente)
            return res.data.body;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerClientesActivos(){
        try {
            const res = await axios.get('http://localhost:4000/api/clientes')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerTodosClientes(){
        try {
            const res = await axios.get('http://localhost:4000/api/clientes/history')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerCliente(id){
        try {
            const res = await axios.get('http://localhost:4000/api/clientes/'+id)
            return res;
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarCliente(cliente){
        try {
            const res = await axios.post('http://localhost:4000/api/clientes',cliente)
            console.log(res.data.body)
            return res.data.body;
        } catch (error) {
            console.log(error)
            return null;
            
        }
    },
    async actualizarCliente(cliente){
        try {
            const res = await axios.post('http://localhost:4000/api/clientes',cliente)
           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarCliente(idClientes){
        try {
            const res = await axios.put('http://localhost:4000/api/clientes/',{
                "idClientes":idClientes
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
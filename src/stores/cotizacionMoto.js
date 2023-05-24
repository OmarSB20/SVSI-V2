import { defineStore } from "pinia";
import axios from "axios";

export const cotizacionMotoStore = defineStore("cotizacionMoto",{
  state: ()=>({
    Moto_idMoto:null,
    Cotizaciones_idCotizaciones:null
  }), 
  actions:{
    setIdMoto(id){
        this.Moto_idMoto = id;
        console.log(this.Moto_idMoto)
    },

    getIdMoto(){
        console.log(this.Moto_idMoto)
        return this.Moto_idMoto;
    },
    setIdCotizacion(cotizacion){
        this.Cotizaciones_idCotizaciones=cotizacion ;
        console.log(this.Cotizaciones_idCotizaciones)
    },

    getIdCotizacion(){
        console.log(this.Cotizaciones_idCotizaciones)
        return this.Cotizaciones_idCotizaciones;
    },

    async traerCotizacionMotos(){
        console.log("TRAER COTIZACIONES");
        try {
            const res = await axios.get('http://localhost:4000/api/cotizacionesMoto')
            return res.data.body;

        } catch (error) {
            console.log(error)
            throw (error);
        }
        

    },
    async agregarMotosACotizacion(idMotocicleta, idCotizaciones){
        try {
            const res = await axios.post('http://localhost:4000/api/cotizacionesMoto',{
                "Cotizaciones_idCotizaciones": idCotizaciones,
                "Moto_idMoto": idMotocicleta
            })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    // async clienteExiste(cliente){
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/clientes/existe',cliente)
    //         return res.data.body;
            
    //     } catch (error) {
    //         console.log(error)
    //         throw(error);
    //     }
    // },

    // async obtenerClientesActivos(){
    //     try {
    //         const res = await axios.get('http://localhost:4000/api/clientes')
    //         return res;
            
    //     } catch (error) {
    //         console.log(error)
    //         throw(error);
    //     }
    // },

    // async obtenerTodosClientes(){
    //     try {
    //         const res = await axios.get('http://localhost:4000/api/clientes/history')
    //         return res;
            
    //     } catch (error) {
    //         console.log(error)
    //         throw(error);
    //     }
    // },

    // async obtenerCliente(id){
    //     try {
    //         const res = await axios.get('http://localhost:4000/api/clientes/'+id)
    //         return res;
    //     } catch (error) {
    //         console.log(error)
    //         throw(error);
    //     }
    // },

    // async agregarCliente(cliente){
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/clientes',cliente)
    //         console.log(res.data.body)
    //         return res.data.body;
    //     } catch (error) {
    //         console.log(error)
    //         return null;
            
    //     }
    // },
    // async actualizarCliente(cliente){
    //     try {
    //         const res = await axios.post('http://localhost:4000/api/clientes',cliente)
    //        console.log(res)
    //         return ;
            
    //     } catch (error) {
    //         console.log(error)
    //         return ;
            
    //     }
    // },

    // async eliminarCliente(idClientes){
    //     try {
    //         const res = await axios.put('http://localhost:4000/api/clientes/',{
    //             "idClientes":idClientes
    //     });

    //        console.log(res)
    //         return ;
            
    //     } catch (error) {
    //         console.log(error)
    //         return ;
            
    //     }
    // },
  } 
})
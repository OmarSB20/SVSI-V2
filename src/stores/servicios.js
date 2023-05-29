import { defineStore } from "pinia";
import axios from "axios";


export const serviciosStore = defineStore("serviciosStore",{
  state: ()=>({
    token:"",
    idServicioActual: ""

  }), 

  actions:{

    setToken(token){
        this.token = token;
    },


    getToken(){
        return this.token;
    },

    //trae todos los usuarios ACTIVOS
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
            console.log("OBTENIENDO SERVICIO");
            console.log(id);
            const res = await axios.get('http://localhost:4000/api/servicios/'+id)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

//Trae TODOS los nombres de usuario que existen
    async obtenerNicknames(){
        try {
            const res = await axios.get('http://localhost:4000/api/servicios/nicks')
            return res;
        } catch (error) {
            console.log(error)
        }
    },
//Trae los datos solo del usuario especificado, hay que mandarle el idEmpleados
    async obtenerUnSer(idServicios){
        try {
            if (idServicios=="") {
                throw error
            }
            console.log('http://localhost:4000/api/servicios/'+idServicios)
            const res = await axios.get('http://localhost:4000/api/servicios/'+idServicios)
            return res;
        } catch (error) {
            throw error
        }
    },



    //metodos para resibir usuario y guardar el que se esta modificando

    setIdServicios(idServicios){
        this.idServicioActual = idServicios
    },


    getIdServicios(){
        return this.idServicioActual
    },
    
    //hay que mandarle el json ya creado
    async agregarServicios(servicios){
        try {
            //nos retorna el id del usuario creado
            const res = await axios.post('http://localhost:4000/api/servicios',servicios)
           console.log(res)
            return res;
            
        } catch (error) {
            console.log(error)
            return -1;
            
        }
    },
    //hay que mandarle el json ya creado
    async actualizarServicios(servicios){
        try {
            const res = await axios.post('http://localhost:4000/api/servicios',servicios)
           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    
    
  } 
})


  

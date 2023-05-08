import { defineStore } from "pinia";
import axios from "axios";

export const mediosContactoStore = defineStore("mediosContacto",{
  state: ()=>({
    medioContacto: [],
    idmedioActual:0
  }), 
  actions:{

    setmedioContacto(idMedioDeContacto){
       
        this.idmedioActual = idMedioDeContacto;
        console.log(this.idmedioActual)
    },

    getmedioContacto(){
        console.log(this.idmedioActual)
        return this.idmedioActual;
    },

    async obtenerMedios(){
        try {
            const res = await axios.get('http://localhost:4000/api/mediosContacto')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async obtenerMediosN(id){
        try {
            const res = await axios.get('http://localhost:4000/api/mediosContacto/'+id)
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    
    async obtenerNombresMedios(){
        try {
            const res = await axios.get('http://localhost:4000/api/mediosContacto/nombreMedios')
            return res;
            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    },

    async agregarMediosContacto(nombreMediosContacto){
        try {
            
            const res = await axios.post('http://localhost:4000/api/mediosContacto',{"idMedioDeContacto":0,
            "Descripcion":nombreMediosContacto
            
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },
    async actualizarMedioContacto(idMedioDeContacto, nombreMediosContacto){
        try {
            console.log(idMedioDeContacto);
            console.log(nombreMediosContacto);
            const res = await axios.post('http://localhost:4000/api/mediosContacto',{"idMedioDeContacto":idMedioDeContacto,
            "Descripcion":nombreMediosContacto
           
           })

           console.log(res)
            return ;
            
        } catch (error) {
            console.log(error)
            return ;
            
        }
    },

    async eliminarMedioContacto(idMedioDeContacto){
        try {
            const res = await axios.put('http://localhost:4000/api/mediosContacto/',{
                "idMedioDeContacto":idMedioDeContacto
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
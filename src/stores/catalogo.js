import { defineStore } from "pinia";
import axios from "axios";

export const catalogoStore = defineStore("catalogo",{
    state: ()=>({
        token:"",
        idMotocicletaActual: ""
    
    }), 

    actions:{

        //tokens
        setToken(token){
            this.token = token;
        },
    
    
        getToken(){
            return this.token;
        },


        setidMotocicleta(idMotocicleta) {
            this.idMotocicletaActual = idMotocicleta;
        },
        getidMotocicleta() {
            return this.idMotocicletaActual;
        },

        //consulta todas las motos de la base de datos
        async consultarMotocicletas() {
            try {
                const res = await axios.get('http://localhost:4000/api/motos')
                return res;
            }catch(error){
                console.log(error)
                throw(error);
            }
        },

        //consultar un modelo en especifico
        async obtenerUnModelo(idMotocicleta) {
            try{
                if(idMotocicleta == ""){
                    throw error
                }
                console.log('http://localhost:4000/api/motos/'+idMotocicleta)
                const res = await axios.get('http://localhost:4000/api/motos/'+idMotocicleta)
                return res;
            }catch(error){
                throw error
            }
        },

        async agregarModelo(modelo){
            try{
                const res = await axios.post('http://localhost:4000/api/motos',modelo)
                console.log(res)
                return res;
            }catch(error){
                console.log(error)
                return -1;
            }
        },

        async actualizarModelo(modelo){
            try{
                const res = await axios.post('http://localhost:4000/api/motos',modelo)
                console.log(res)
                return ;
            }catch(error){
                console.log(error)
                return ;
            }
        }
    }
})
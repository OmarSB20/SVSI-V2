import { defineStore } from "pinia";
import axios from "axios";

export const motosTallerStore = defineStore("motosTaller",{
    state: ()=>({
        token:"",
        idMotoTallerActual: ""
    
    }), 

    actions:{

        //tokens
        setToken(token){
            this.token = token;
        },
    
    
        getToken(){
            return this.token;
        },


        setidMotosTaller(idMotosTaller) {
            this.idMotoTallerActual = idMotosTaller;
        },
        getidMotosTaller() {
            return this.idMotoTallerActual;
        },

        //consulta todas las motos de la base de datos
        async consultarMotosTaller() {
            try {
                const res = await axios.get('http://localhost:4000/api/motosTaller')
                return res;
            }catch(error){
                console.log(error)
                throw(error);
            }
        },

        //consultar un modelo en especifico
        async obtenerUnaMotoTaller(idMotosTaller) {
            try{
                if(idMotosTaller == ""){
                    throw error
                }
                console.log('http://localhost:4000/api/motosTaller/'+idMotosTaller)
                const res = await axios.get('http://localhost:4000/api/motosTaller/'+idMotosTaller)
                return res;
            }catch(error){
                throw error
            }
        },

        async agregarMotoTaller(modelo){
            try{
                const res = await axios.post('http://localhost:4000/api/motosTaller',modelo)
                console.log(res)
                return res;
            }catch(error){
                console.log(error)
                return -1;
            }
        },

        async actualizarMotoTaller(modelo){
            try{
                const res = await axios.post('http://localhost:4000/api/motosTaller',modelo)
                console.log(res)
                return ;
            }catch(error){
                console.log(error)
                return ;
            }
        }
    }
})
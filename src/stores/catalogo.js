import { defineStore } from "pinia";
import axios from "axios";

export const catalogoStore = defineStore("catalogo",{
    state: ()=>({
        token:"",
        idMotocicleta: ""
    
    }), 

    actions:{
        setidMotocicleta(idMotocicleta) {
            this.idMotocicleta = idMotocicleta;
        },
        getidMotocicleta() {
            return this.idMotocicleta;
        },
        async consultarMotocicletas() {
            try {

            }catch{
                
            }
        }
    }
})
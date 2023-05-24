import { defineStore } from "pinia";
import axios from "axios";

export const cotizacionesMotosStore = defineStore("cotizacionesMotos",{
    state: ()=>({
        idCotizaciones:null,
        interfazOrigen:null
      }), 
      actions:{
        async agregarMotosACotizacion(idMotocicleta, idCotizaciones){
            try {
                const res = await axios.post('http://localhost:4000/api/motosCotizaciones',{
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
      }
})
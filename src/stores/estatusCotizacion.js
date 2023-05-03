import { defineStore } from "pinia";
import axios from "axios";

export const estatusCotizacionStore = defineStore("estatuscotizacion",{
    state: ()=>({
      estatusCotizacion: [],
      idEstCotActual:0
    }), 
    actions:{
  
      setEstatusCotizacion(idEstatusCotizacion){
         
          this.idEstCotActual = idEstatusCotizacion;
          console.log(this.idEstCotActual)
      },
  
      getEstatusCotizacion(){
          console.log(this.idEstCotActual)
          return this.idEstCotActual;
      },
  
      async obtenerEstatusCotizacion(){
          try {
              const res = await axios.get('http://localhost:4000/api/estatusCotizacion')
              return res;
              
          } catch (error) {
              console.log(error)
              throw(error);
          }
      },
  
      async obtenerEstatusCotizacionN(id){
          try {
              const res = await axios.get('http://localhost:4000/api/estatusCotizacion/'+id)
              return res;
              
          } catch (error) {
              console.log(error)
              throw(error);
          }
      },
  
      
      async obtenerNombresEstatusCotizacion(){
          try {
              const res = await axios.get('http://localhost:4000/api/creditos/nombreEstatusCotizacion')
              return res;
              
          } catch (error) {
              console.log(error)
              throw(error);
          }
      },
  
      async agregarEstatusCotizacion(nombreEstCot){
          try {
              
              const res = await axios.post('http://localhost:4000/api/estatusCotizacion',{"idEstatusCotizacion":0,
              "Descripcion":nombreEstCot,
              "idEstatusActividad":1
             })
  
             console.log(res)
              return ;
              
          } catch (error) {
              console.log(error)
              return ;
              
          }
      },
      async actualizarEstatusCotizacion(idEstatusCotizacion, nombreEstatusCotizacion,idEstatus){
          try {
              console.log(idEstatusCotizacion);
              console.log(nombreEstatusCotizacion);
              const res = await axios.post('http://localhost:4000/api/estatusCotizacion',{"idEstatusCotizacion":idEstatusCotizacion,
              "Descripcion":nombreEstatusCotizacion,
              "idEstatusActividad":idEstatus
             })
  
             console.log(res)
              return ;
              
          } catch (error) {
              console.log(error)
              return ;
              
          }
      },
  
      async eliminarEstatusCotizacion(idEstatusCotizacion){
          try {
              const res = await axios.put('http://localhost:4000/api/estatusCotizacion/',{
                  "idEstatusCotizacion":idEstatusCotizacion
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
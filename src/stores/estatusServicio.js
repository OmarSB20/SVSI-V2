import { defineStore } from "pinia";
import axios from "axios";

export const estatusServicioStore = defineStore("estatusservicio",{
    state: ()=>({
      estatusServicio: [],
      idEstSerActual:0
    }), 
    actions:{
  
      setEstatusServicio(idEstatusServicio){
         
          this.idEstSetActual = idEstatusServicio;
          console.log(this.idEstSetActual)
      },
  
      getEstatusServicio(){
          console.log(this.idEstSerActual)
          return this.idEstSerActual;
      },
  
      async obtenerEstatusServicios(){
          try {
              const res = await axios.get('http://localhost:4000/api/estatusServicio')
              return res;
              
          } catch (error) {
              console.log(error)
              throw(error);
          }
      },
  
      async obtenerEstatusServicioN(id){
          try {
              const res = await axios.get('http://localhost:4000/api/estatusServicio/'+id)
              return res;
              
          } catch (error) {
              console.log(error)
              throw(error);
          }
      },
  
      
      async obtenerNombresEstatusServicio(){
          try {
              const res = await axios.get('http://localhost:4000/api/estatusServicio/nombreEstSer')
              return res;
              
          } catch (error) {
              console.log(error)
              throw(error);
          }
      },
  
      async agregarEstatusServicio(nombreEstSer){
          try {
              
              const res = await axios.post('http://localhost:4000/api/estatusServicio',{"idEstatusServicio":0,
              "Descripcion":nombreEstSer,
              "idEstatusActividad":1
             })
  
             console.log(res)
              return ;
              
          } catch (error) {
              console.log(error)
              return ;
              
          }
      },
      async actualizarEstatusServicio(idEstatusServicio, nombreEstatusServicio,idEstatus){
          try {
              console.log(idEstatusServicio);
              console.log(nombreEstatusServicio);
              const res = await axios.post('http://localhost:4000/api/estatusServicio',{"idEstatusServicio":idEstatusServicio,
              "Descripcion":nombreEstatusServicio,
              "idEstatusActividad":idEstatus
             })
  
             console.log(res)
              return ;
              
          } catch (error) {
              console.log(error)
              return ;
              
          }
      },
  
      async eliminarEstatusServicio(idEstatusServicio){
          try {
              const res = await axios.put('http://localhost:4000/api/estatusServicio/',{
                  "idEstatusServicio":idEstatusServicio
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
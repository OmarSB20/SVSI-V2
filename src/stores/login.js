import { defineStore } from "pinia";
import axios from "axios";

export const loginStore = defineStore("login",{
  state: ()=>({
    token: null
  }), 
  actions:{
    async login(usuario){
        try {
            const res = await axios.post('http://localhost:4000/api/usuarios/login',usuario);
            console.log(res);
            console.log(res.data.body.token)
            this.token = res.data.body.token;
            return res.data.body.token != null;
            
        } catch (error) {
            console.log(error)
        }
    },

    getToken(){
      console.log(this.token)
        return this.token;
    }
  } 
})

  

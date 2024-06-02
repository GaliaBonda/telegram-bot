const axios = require('axios');
require('dotenv').config();

const BASE_URL = `https://api.telegram.org/bot${process.env.BOT_API_TOKEN}`

const instance = axios.create({
    baseURL: BASE_URL,
  });

class AxiosInstance {
        async get(method, params) {
            try {
              return await instance.get(`/${method}`, {
                params
            })  
            } catch (error) {
                console.log(`Axios error: ${error}`)
            }
            
        }

        async post(method, data) {
            try {
               return await instance.post(`/${method}`, {
                data
            }) 
            } catch (error) {
                console.log(`Axios error: ${error}`)
            }
            
        }
}

const axiosInstance = new AxiosInstance();

module.exports = { axiosInstance }
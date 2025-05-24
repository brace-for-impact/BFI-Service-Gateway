import express from "express"
import { config } from "./config.js";


const app=express()
const port=process.env.PORT


app.listen(config.port,()=>console.log(`Gateway Service running in ${port}`))

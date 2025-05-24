import express, { Request, Response } from "express"
import { apiLogger } from "./middlewares/apiLogger";
import shared from "@brace-for-impact/bfi-shared"
const app=express()

app.use(express.json())
app.use(apiLogger({
    logHttpMethod: true,
    logRequestUrl: true,
    logRequestBody: true,
    logResponseTime: true,
    logStatusCode: true,
  }));

app.get('/api/v1/health',(req:Request,res:Response)=>{
    const data=shared.config.testServices.testConfigService()
    res.status(200).json({status:"true",message:"Auth server is healty"})
})

export default app
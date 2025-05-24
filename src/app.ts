import express, { Request, Response } from "express"
import { apiLogger } from "./middlewares/apiLogger";
import shared from "@brace-for-impact/bfi-shared"
import Docker from "dockerode";

const app = express()
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

app.use(express.json())
app.use(apiLogger({
    logHttpMethod: true,
    logRequestUrl: true,
    logRequestBody: true,
    logResponseTime: true,
    logStatusCode: true,
  }));

app.get('/api/health',async (req:Request,res:Response)=>{
    res
      .status(200)
      .json({
        status:"true",
        message:"Auth server is healty",
        data: await shared.services.dockerServices.getContainerServices({docker, networkName: "bfi-infrastructure_bfi-dev-net" })
      })
})

export default app;
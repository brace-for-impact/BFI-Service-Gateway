import express, { Request, Response } from "express"
import { apiLogger } from "./middlewares/apiLogger";
import shared from "@brace-for-impact/bfi-shared"
import { config } from "./config";

const app = express()

app.use(express.json())
app.use(apiLogger({
  logHttpMethod: true,
  logRequestUrl: true,
  logRequestBody: true,
  logResponseTime: true,
  logStatusCode: true,
}));

app.use(shared.middlewares.requestCounter({config}));


app.get('/api/health',async (req:Request,res:Response)=>{
  const [containerInfo, hostMachineInfo, serverInfo] = await Promise.all([
    shared.services.dockerServices.services?.getContainerInfo(),
    shared.services.hostServices.getHostInfo(),
    shared.services.nodeServices.getNodeProcessInfo({requestsPerSecond: config?.requestsPerSecond}),
  ]);
  res
    .status(200)
    .json({
      status:"true",
      message:"Gateway server is healthy",
      containerInfo,
      hostMachineInfo,
      serverInfo
    })
})


export default app;
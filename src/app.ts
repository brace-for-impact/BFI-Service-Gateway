import express, { Request, Response } from "express";
import shared from "@brace-for-impact/bfi-shared";
import Docker from "dockerode";
import expressAsyncHandler from "express-async-handler";

const app = express();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

app.use(express.json());
app.use(
  shared.middlewares.apiLogger({
    logHttpMethod: true,
    logRequestUrl: true,
    logRequestBody: true,
    logResponseTime: true,
    logStatusCode: true,
  })
);

app.get(
  "/api/health",
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      status: "true",
      message: "Auth server is healty",
      data: await shared.services.dockerServices.getContainerServices({
        docker,
        networkName: "bfi-infrastructure_bfi-dev-net",
      }),
    });
  })
);

app.use(shared.middlewares.errorHandler);

export default app;

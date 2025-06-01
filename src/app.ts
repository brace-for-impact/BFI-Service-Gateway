import express, { Request, Response } from "express";
import shared from "@brace-for-impact/bfi-shared";
import { config } from "./config";
import expressAsyncHandler from "express-async-handler";
import { setupMiddlewares } from "./middlewares";
import publishHealth from "./helpers/healthPublisher";

const app = express();

setupMiddlewares(app);
publishHealth()

let intervalId: NodeJS.Timeout | null = null;

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.get(
  "/api/status",
  expressAsyncHandler(async (req: Request, res: Response) => {
    console.log({ config: config?.requestsPerSecond });

    await shared.services.dockerServices.bootDockerServices();

    // const [containerInfo, hostMachineInfo, serverInfo] = await Promise.all([
    //   shared.services.dockerServices.services?.getContainerInfo(),
    //   shared.services.hostServices.getHostInfo(),
    //   shared.services.nodeServices.getNodeProcessInfo({requestsPerSecond: config?.requestsPerSecond}),
    // ]);

    res.status(200).json({
      status: "true",
      message: "Gateway server is healthy",
      // containerInfo,
      // hostMachineInfo,
      // serverInfo,
      no: shared.middlewares.requestCounterService.getRequestsPerSecond(),
      docker_info:
            await shared.services.dockerServices.services?.getContainerServices(
              {networkName:config.NETWORK_NAME}
            )
    });
  })
);

export default app;

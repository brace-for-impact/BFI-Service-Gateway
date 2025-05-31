import express, { Request, Response } from "express";
import shared from "@brace-for-impact/bfi-shared";
import { config } from "./config";
import expressAsyncHandler from "express-async-handler";
import { setupMiddlewares } from "./middlewares";
import { publishToKafka, startKafkaServices } from "./kafka/kafka.service";

const app = express();

setupMiddlewares(app);
(async () => {
  try {
    await startKafkaServices();
    console.log("Kafka started");
  } catch (err) {
    console.error("Failed to start Kafka:", err);
  }
})();

let intervalId: NodeJS.Timeout | null = null;

app.get(
  "/api/health",
  expressAsyncHandler(async (req: Request, res: Response) => {
    console.log({ config: config?.requestsPerSecond });

    await shared.services.dockerServices.bootDockerServices();

    // const [containerInfo, hostMachineInfo, serverInfo] = await Promise.all([
    //   shared.services.dockerServices.services?.getContainerInfo(),
    //   shared.services.hostServices.getHostInfo(),
    //   shared.services.nodeServices.getNodeProcessInfo({requestsPerSecond: config?.requestsPerSecond}),
    // ]);

    const key = "health status";
    const value = "Gateway server is healthy";

    await publishToKafka("monitor-events", key, value);

    console.log("running infinite ");
    if (!intervalId) {
      console.log("Starting health publishing...");
      intervalId = setInterval(() => {
        const data = JSON.stringify({
          healthStatus: "Server is healthy",
          apiRequestPerSecond:
            shared.middlewares.requestCounterService.getRequestsPerSecond(),
          docker_info:
            shared.services.dockerServices.services?.getContainerServices(
              {networkName:"bfi-infrastructure_bfi-dev-net"}
            ),
        });
        publishToKafka("monitor-events", "health status", data);
      }, 1000);
    }

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

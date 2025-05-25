import { config } from "./config";
import app from "./app";
import shared from "@brace-for-impact/bfi-shared"

const port=config.port

const startServer = async () => {
    await shared.services.dockerServices.bootDockerServices()
    await shared.services.kafkaServices.getKafkaServices({
        brokers: [`${config.SERVICE_NAME_KAFKA}:${config.KAFKA_CONTAINER_PORT}`],
        clientId: config?.clientId,
        groupId: 'group-service-metrics'
    })
    app.listen(port,()=>console.log(`Auth Service running in ${port}`))
}

startServer()
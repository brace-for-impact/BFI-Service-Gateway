import shared from "@brace-for-impact/bfi-shared";
import { config } from "../config";
let kafkaService: Awaited<ReturnType<typeof shared.services.kafkaServices.initKafka>>;

export const startKafkaServices = async () => {
  await shared.services.kafkaServices.initKafka({
    clientId: config.clientId,
    brokers: [`${config.SERVICE_NAME_KAFKA}:${config.KAFKA_CONTAINER_PORT}`],
    groupId: config.KAFKA_CONSUMER_GROUP_ID,
  });

  await shared.services.kafkaServices.consume({
    topics: ["gateway-events"],
    onMessage: async ({ topic, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();
      console.log(`[Kafka] ⬇️ Consumed: ${key} → ${value}`);
    },
  });

  console.log("✅ Kafka consumer + producer ready.");
}; 

// Utility to publish messages
export const publishToKafka = async (topic: string, key: string, value: any) => {

  await shared.services.kafkaServices.send({
    topic,
    messages: [{ key, value }],
  });

  console.log(`[Kafka] ⬆️ Published to ${topic}: ${key} → ${value}`);
};

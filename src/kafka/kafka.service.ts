import shared from "@brace-for-impact/bfi-shared";
let kafkaService: Awaited<ReturnType<typeof shared.services.kafkaServices.getKafkaServices>>;

export const startKafkaServices = async () => {
  kafkaService = await shared.services.kafkaServices.getKafkaServices({
    clientId: "gateway-service",
    brokers: [process.env.KAFKA_BROKERS || "bfi-dev-kafka:9092"],
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "gateway-service-group",
  });

  await kafkaService.consume({
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
  if (!kafkaService) {
    throw new Error("Kafka service not initialized. Did you call startKafkaServices()?");
  }

  await kafkaService.send({
    topic,
    messages: [{ key, value }],
  });

  console.log(`[Kafka] ⬆️ Published to ${topic}: ${key} → ${value}`);
};

import dotenv from 'dotenv';
import path from 'path';

interface AppConfig {
  env: string;
  port: number;
  requestsPerSecond: number,
  clientId: string,
  SERVICE_NAME_KAFKA: string,
  KAFKA_CONTAINER_PORT: number,
  KAFKA_CONSUMER_GROUP_ID: string
}
declare const __dirname: string;
const envFile = `.env.gateway.${process.env.NODE_ENV || 'development'}`;

dotenv.config({
  path: path.resolve(__dirname, `../../bfi-infrastructure/service-envs/${envFile}`),
});

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  requestsPerSecond: 0,
  ...(process.env ?? {}),
  clientId: process.env.CLIENT_ID ?? "UNKNOWN_CLIENT",
  SERVICE_NAME_KAFKA: process.env.SERVICE_NAME_KAFKA ?? "",
  KAFKA_CONTAINER_PORT: parseInt(process.env.KAFKA_CONTAINER_PORT ?? '0'),
  KAFKA_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID ?? "",
  NETWORK_NAME:process.env.NETWORK_NAME??""
};

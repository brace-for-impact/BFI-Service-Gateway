// src/config.ts
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

interface AppConfig {
    env: string;
    port: number;
  }
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({
  path: path.resolve(__dirname, `../${envFile}`),
});

export const config:AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};

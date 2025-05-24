import dotenv from 'dotenv';
import path from 'path';

interface AppConfig {
  env: string;
  port: number;
}
declare const __dirname: string;
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({
  path: path.resolve(__dirname, `../${envFile}`),
});

export const config: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};

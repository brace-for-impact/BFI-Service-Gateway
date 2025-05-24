// middleware/apiLogger.ts
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

interface ApiLoggerConfig {
  logRequestBody?: boolean;
  logRequestHeaders?: boolean;
  logHttpMethod?: boolean;
  logRequestUrl?: boolean;
  logStatusCode?: boolean;
  logResponseTime?: boolean;
}

export function apiLogger(config: ApiLoggerConfig = {}) {
  const morganLogger = morgan((tokens, req, res) => {
    const parts: string[] = [];
    if (config.logHttpMethod) parts.push(`Method: ${tokens.method(req, res)}`);
    if (config.logRequestUrl) parts.push(`URL: ${tokens.url(req, res)}`);
    if (config.logStatusCode) parts.push(`Status: ${tokens.status(req, res)}`);
    if (config.logResponseTime) parts.push(`Response Time: ${tokens['response-time'](req, res)} ms`);

    return `[API Exit] ${parts.join(' | ')}`;
  });

  return (req: Request, res: Response, next: NextFunction) => {
    // ENTRY LOGGING
    const entryParts: string[] = [];
    if (config.logHttpMethod) entryParts.push(`Method: ${req.method}`);
    if (config.logRequestUrl) entryParts.push(`URL: ${req.originalUrl}`);
    if (config.logRequestHeaders) entryParts.push(`Headers: ${JSON.stringify(req.headers)}`);
    if (config.logRequestBody && req.body) entryParts.push(`Body: ${JSON.stringify(req.body)}`);

    if (entryParts.length > 0) {
      console.log(`[API Entry] ${entryParts.join(' | ')}\n`);
    }

    // Run morgan logging for exit
    morganLogger(req, res, next);
  };
}

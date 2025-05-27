import express from "express";
import shared from "@brace-for-impact/bfi-shared";

export const setupMiddlewares = (app: express.Express) => {
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
  app.use(shared.middlewares.errorHandler);
};

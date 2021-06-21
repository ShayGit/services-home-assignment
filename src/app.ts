import { basicErrorHandler, handle404 } from "./error-handler";
import express, { Express, NextFunction, Request, Response } from "express";

import { InMemoryServicesStore } from "./db/services-db";
import serviceRouter from "./routes/services-routes";

export const servicesRepository = new InMemoryServicesStore();

const PORT = process.env.PORT || 8000;

const app: Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Methods", "GET,POST");
  next();
});

app.use(express.json());

app.use(serviceRouter);

app.use(handle404);
app.use(basicErrorHandler);

export const server = app.listen(PORT, () =>
  console.log(`Server is running: http://localhost:${PORT}`)
);

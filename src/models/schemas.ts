import Joi from "joi";
import { Service } from "./Service";

export interface deployEvent {
  serviceName: string;
  time: Date;
  changedFiles: string[];
  oldSpec: {
    version: string;
    image: string;
    replicas: number;
  };
  newSpec: {
    version: string;
    image: string;
    replicas: number;
  };
}

export interface healthEvent {
  serviceName: string;
  time: Date;
  isHealthy: boolean;
  reason: string | null;
}

export interface serviceStateResponse {
  isHealthy: boolean;
  reason: string | null;
  image: string;
  lastDeployTime: Date;
  replicas: number;
}

export interface serviceEventsResponse {
  deployEvents: deployEvent[];
  healthEvents: healthEvent[];
}

export interface ResponseError extends Error {
  status?: number;
}

export interface ServicesStoreDAO {
  create(serviceId: string, deployEvent: deployEvent): Service;
  getAll(): Service[];
  findById(serviceId: string): Service;
  existsById(serviceId: string): boolean;
  update(service: Service): void;
}

export const deployValidationSchema = Joi.object({
  serviceId: Joi.string().required(),
  serviceName: Joi.string().required(),
  changedFiles: Joi.array().items(Joi.string()).required(),
  oldSpec: Joi.object({
    version: Joi.string(),
    image: Joi.string(),
    replicas: Joi.number(),
  }),
  newSpec: Joi.object({
    version: Joi.string().required(),
    image: Joi.string().required(),
    replicas: Joi.number().required(),
  }).required(),
}).required();

export const healthValidationSchema = Joi.object({
  serviceId: Joi.string().required(),
  isHealthy: Joi.boolean().required(),
  reason: Joi.string(),
}).required();

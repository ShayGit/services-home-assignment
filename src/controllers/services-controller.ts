import * as servicesLogic from "../business-logic/services-logic";

import {
  deployValidationSchema,
  healthValidationSchema,
} from "../models/schemas";

import { RequestHandler } from "express";

export const postServiceDeployEvent: RequestHandler = (req, res, next) => {
  try {
    const { value, error } = deployValidationSchema.validate(req.body);
    if (!error) {
      const resMessage = servicesLogic.addServiceDeployEvent(value);
      res.json(resMessage);
    } else {
      next();
    }
  } catch (error) {
    error.status = 404;
    next(error);
  }
};
export const postServiceHealthEvent: RequestHandler = (req, res, next) => {
  try {
    const { value, error } = healthValidationSchema.validate(req.body);
    if (!error) {
      const resMessage = servicesLogic.addServiceHealthEvent(value);
      res.json(resMessage);
    } else {
      throw new Error("Request Body payload does not match any type of event");
    }
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const getServicesState: RequestHandler = (req, res, next) => {
  try {
    const servicesState = servicesLogic.getServicesCurrentState();
    return res.status(200).json(servicesState);
  } catch (error) {
    next(error);
  }
};

export const getServiceState: RequestHandler = (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    const serviceState = servicesLogic.getServiceCurrentState(serviceId);
    return res.status(200).json(serviceState);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const getServiceEvents: RequestHandler = (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    const eventsResponse = servicesLogic.getServiceEvents(serviceId);
    return res.status(200).json(eventsResponse);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

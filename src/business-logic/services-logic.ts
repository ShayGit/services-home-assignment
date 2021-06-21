import { Service } from "../models/Service";
import { healthEvent } from "../models/schemas";
import { servicesRepository } from "../app";

export const addServiceDeployEvent = (deployBody: any) => {
  const time = new Date();
  deployBody.time = time;
  let response;

  const { serviceId, ...deployEvent } = deployBody;
  if (!servicesRepository.existsById(serviceId)) {
    servicesRepository.create(serviceId, deployEvent);
  } else {
    const service = servicesRepository.findById(serviceId);
    service.addDeployEvent(deployEvent);
    servicesRepository.update(service);
  }
  response = { message: "Deploy Event Processed Successfully" };
  return response;
};

export const addServiceHealthEvent = (healthBody: any) => {
  const time = new Date();
  let response;
  const { serviceId, ...healthEventValues } = healthBody;
  if (!servicesRepository.existsById(serviceId)) {
    throw new Error(
      `Cannot process Health Status Event, Service with id:${serviceId} does not exist`
    );
  } else {
    const service = servicesRepository.findById(serviceId);
    const lastDeployEvent = service.getLastDeploy();
    const lastHealthEvent = service.getLastHealthChange();

    if (lastHealthEvent.isHealthy !== healthEventValues.isHealthy) {
      const healthEvent: healthEvent = {
        serviceName: lastDeployEvent.serviceName,
        ...healthEventValues,
        reason: healthEventValues.isHealthy ? null : healthEventValues.reason,
        time,
      };
      service.addHealthEvent(healthEvent);
      servicesRepository.update(service);
      response = { message: "Health Status Event Processed Successfully" };
    } else {
      response = {
        message: `Service ${serviceId} health status did not change, service is ${
          healthEventValues.isHealthy ? "" : "not "
        }healthy`,
      };
    }
  }
  return response;
};

export const getServicesCurrentState = () => {
  const servicesData = servicesRepository.getAll();
  const servicesState = servicesData.map((service: Service) =>
    service.getCurrentState()
  );
  return servicesState;
};

export const getServiceCurrentState = (serviceId: string) => {
  const service = servicesRepository.findById(serviceId);
  const serviceState = service.getCurrentState();
  return serviceState;
};

export const getServiceEvents = (serviceId: string) => {
  const service = servicesRepository.findById(serviceId);
  const serviceEventsResponse = service.getServiceEvents();

  return serviceEventsResponse;
};

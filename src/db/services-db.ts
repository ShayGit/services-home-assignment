import { ServicesStoreDAO, deployEvent } from "../models/schemas";

import { Service } from "../models/Service";

const services = new Map<string, Service>();

export class InMemoryServicesStore implements ServicesStoreDAO {
  findById(serviceId: string) {
    const service = services.get(serviceId);
    if (service) {
      return service;
    } else {
      throw new Error(`Service with id ${serviceId} does not exist`);
    }
  }
  getAll() {
    return Array.from(services).map(([id, service]) => service);
  }
  create(serviceId: string, deployEvent: deployEvent) {
    const newService = new Service(serviceId, deployEvent);
    services.set(serviceId, newService);

    return newService;
  }

  update(service: Service) {
    if (services.has(service.serviceId)) {
      services.set(service.serviceId, service);
    } else {
      throw new Error(`Service with id ${service.serviceId} does not exist`);
    }
  }

  existsById(serviceId: string) {
    if (services.has(serviceId)) {
      return true;
    } else {
      return false;
    }
  }
}

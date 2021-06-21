import {
  deployEvent,
  healthEvent,
  serviceEventsResponse,
  serviceStateResponse,
} from "./schemas";

export class Service {
  private _serviceId: string;
  private _deployEvents: deployEvent[];
  private _healthEvents: healthEvent[];

  constructor(serviceId: string, deployEvent: deployEvent) {
    this._serviceId = serviceId;
    this._deployEvents = [deployEvent];
    const healthEvent: healthEvent = {
      serviceName: deployEvent.serviceName,
      time: deployEvent.time,
      isHealthy: true,
      reason: null,
    };
    this._healthEvents = [healthEvent];
  }
  get serviceId(): string {
    return this._serviceId;
  }

  get deployEvents() {
    return this._deployEvents;
  }
  get healthEvents() {
    return this._healthEvents;
  }

  addDeployEvent(event: deployEvent) {
    this._deployEvents.push(event);
  }
  addHealthEvent(event: healthEvent) {
    this._healthEvents.push(event);
  }

  getCurrentState(): serviceStateResponse {
    const serviceLatestHealth = this.getLastHealthChange();
    const serviceLatestDeploy = this.getLastDeploy();

    const state = {
      isHealthy: serviceLatestHealth.isHealthy,
      reason: serviceLatestHealth.reason,
      image: serviceLatestDeploy.newSpec.image,
      lastDeployTime: serviceLatestDeploy.time,
      replicas: serviceLatestDeploy.newSpec.replicas,
    };
    return state;
  }

  getServiceEvents(): serviceEventsResponse {
    const serviceEvents = {
      deployEvents: this._deployEvents,
      healthEvents: this._healthEvents,
    };
    return serviceEvents;
  }

  getLastDeploy(): deployEvent {
    return this._deployEvents[this._deployEvents.length - 1];
  }

  getLastHealthChange(): healthEvent {
    return this._healthEvents[this._healthEvents.length - 1];
  }
}

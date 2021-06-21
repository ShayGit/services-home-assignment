import request from "supertest";
import { server } from "../app";

describe("Test GET /notExist Bad Request path", () => {
  it("Request should return status 404 and error message", async () => {
    const result = await request(server).get("/notExist");

    expect(result.status).toBe(404);
    expect(result.body).toStrictEqual({
      error: {
        message: "Path not found or method not allowed",
      },
    });
  });
});

describe("Test GET /list/services when there are no services", () => {
  it("Request should return status 200 and body:[]", async () => {
    const result = await request(server).get("/list/services");

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual([]);
  });
});

describe("Test POST /data with bad request body", () => {
  it("Request should return status 404 and error message", async () => {
    const result = await request(server).post("/data").send({
      badProperty: "123",
    });

    expect(result.status).toBe(404);
    expect(result.body).toStrictEqual({
      error: {
        message: "Request Body payload does not match any type of event",
      },
    });
  });
});

describe("Test POST /data with deploy event information", () => {
  it("Request should return status 200 and successfull message", async () => {
    const result = await request(server)
      .post("/data")
      .send({
        serviceId: "1",
        serviceName: "service1",
        changedFiles: ["file1", "file2"],
        oldSpec: {},
        newSpec: {
          version: "1.0",
          image: "image1",
          replicas: 3,
        },
      });

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      message: "Deploy Event Processed Successfully",
    });
  });
});

describe("Test POST /data with health event for existing service and health status didnt change", () => {
  it("Request should return status 200, and health status did not change message", async () => {
    const result = await request(server).post("/data").send({
      serviceId: "1",
      isHealthy: true,
    });

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      message: "Service 1 health status did not change, service is healthy",
    });
  });
});

describe("Test POST /data with health event for existing service and health status updated", () => {
  it("Request should return status 200, and health event processed message", async () => {
    const result = await request(server).post("/data").send({
      serviceId: "1",
      isHealthy: false,
      reason: "service is down",
    });

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      message: "Health Status Event Processed Successfully",
    });
  });
});

describe("Test POST /data with health event for  non-existing service", () => {
  it("Request should return status 404 and error message", async () => {
    const result = await request(server).post("/data").send({
      serviceId: "2",
      isHealthy: false,
      reason: "service is down",
    });

    expect(result.status).toBe(404);
    expect(result.body).toStrictEqual({
      error: {
        message:
          "Cannot process Health Status Event, Service with id:2 does not exist",
      },
    });
  });
});

describe("Test GET /data/<serviceId> for  non-existing service", () => {
  it("Request should return status 404 and error message", async () => {
    const result = await request(server).get("/data/2");

    expect(result.status).toBe(404);
    expect(result.body).toStrictEqual({
      error: { message: "Service with id 2 does not exist" },
    });
  });
});

describe("Test GET /data/<serviceId> for existing service", () => {
  it("Request should return status 200 and current state of the service", async () => {
    const result = await request(server).get("/data/1");

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      image: "image1",
      isHealthy: false,
      lastDeployTime: result.body.lastDeployTime,
      reason: "service is down",
      replicas: 3,
    });
  });
});

describe("Test POST /data with another deploy event for previous service", () => {
  it("Request should return status 200 and successfull message", async () => {
    const result = await request(server)
      .post("/data")
      .send({
        serviceId: "1",
        serviceName: "service2",
        changedFiles: ["file2", "file3"],
        oldSpec: {
          version: "1.0",
          image: "image1",
          replicas: 3,
        },
        newSpec: {
          version: "2.0",
          image: "image2",
          replicas: 5,
        },
      });

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      message: "Deploy Event Processed Successfully",
    });
  });
});

describe("Test GET /list/<serviceId>/events for non-existing service", () => {
  it("Request should return status 404 and error message", async () => {
    const result = await request(server).get("/list/2/events");

    expect(result.status).toBe(404);
    expect(result.body).toStrictEqual({
      error: { message: "Service with id 2 does not exist" },
    });
  });
});

describe("Test GET /list/<serviceId>/events for an existing service", () => {
  it("Request should return status 200 and the service events", async () => {
    const result = await request(server).get("/list/1/events");

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      deployEvents: [
        {
          changedFiles: ["file1", "file2"],
          newSpec: {
            image: "image1",
            replicas: 3,
            version: "1.0",
          },
          oldSpec: {},
          serviceName: "service1",
          time: result.body.deployEvents[0].time,
        },
        {
          changedFiles: ["file2", "file3"],
          newSpec: {
            image: "image2",
            replicas: 5,
            version: "2.0",
          },
          oldSpec: {
            image: "image1",
            replicas: 3,
            version: "1.0",
          },
          serviceName: "service2",
          time: result.body.deployEvents[1].time,
        },
      ],
      healthEvents: [
        {
          isHealthy: true,
          reason: null,
          serviceName: "service1",
          time: result.body.healthEvents[0].time,
        },
        {
          isHealthy: false,
          reason: "service is down",
          serviceName: "service1",
          time: result.body.healthEvents[1].time,
        },
      ],
    });
  });
});

describe("Test POST /data with deploy event for a new service", () => {
  it("Request should return status 200 and successfull message", async () => {
    const result = await request(server)
      .post("/data")
      .send({
        serviceId: "2",
        serviceName: "service12",
        changedFiles: ["file11", "file12"],
        oldSpec: {},
        newSpec: {
          version: "1.0",
          image: "image12",
          replicas: 1,
        },
      });

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual({
      message: "Deploy Event Processed Successfully",
    });
  });
});

describe("Test GET /list/services for existing services (2 Total)", () => {
  it("Request should return status 200 and current state of every service", async () => {
    const result = await request(server).get("/list/services");

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual([
      {
        image: "image2",
        isHealthy: false,
        lastDeployTime: result.body[0].lastDeployTime,
        reason: "service is down",
        replicas: 5,
      },
      {
        image: "image12",
        isHealthy: true,
        lastDeployTime: result.body[1].lastDeployTime,
        reason: null,
        replicas: 1,
      },
    ]);
  });
});

afterAll((done) => {
  server.close();
  done();
});
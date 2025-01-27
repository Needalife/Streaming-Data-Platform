const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const os = require("os");

const CONSUL_HTTP_ADDR = process.env.CONSUL_HTTP_ADDR || "http://localhost:8500";

// Services for registration
const services = [
  { name: "producer-service", port: process.env.PRODUCER_PORT || 3001 },
  { name: "consumer-service", port: process.env.CONSUMER_PORT || 3002 },
  { name: "lifecycle-service", port: process.env.LIFECYCLE_PORT || 3003 },
];

const getIPAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (!iface.internal && iface.family === "IPv4") {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
};

const ipAddress = getIPAddress();

const registerService = async (name, port, address) => {
  const serviceDefinition = {
    Name: name,
    Address: address,
    Port: parseInt(port, 10),
    Check: {
      HTTP: `http://${address}:${port}/health`,
      Interval: "10s",
      Timeout: "5s",
    },
  };

  try {
    console.log(`Registering ${name} with Consul...`);
    await axios.put(
      `${CONSUL_HTTP_ADDR}/v1/agent/service/register`,
      serviceDefinition
    );
    console.log(`${name} registered successfully.`);
  } catch (error) {
    console.error(
      `Failed to register ${name} with Consul:`,
      error.response?.data || error.message
    );
  }
};

// Function to register all services
const registerAllServices = async () => {
  for (const service of services) {
    if (!service.port) {
      console.error(
        `Service ${service.name} is missing a port.`
      );
      continue;
    }
    await registerService(service.name, service.port, ipAddress);
  }
  console.log("All services registered successfully.");
};

registerAllServices();
